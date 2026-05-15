-- Backfill role name into history rows that are missing it.
-- These are UPDATE records on person_role where only valid_till changed, so the
-- trigger's jsonb_diff stripped the unchanged role column. Match by person_id
-- and the exact valid_till timestamp stored in new_values.
UPDATE auth.history h
SET
    old_values = h.old_values || jsonb_build_object('role', pr.role),
    new_values = h.new_values || jsonb_build_object('role', pr.role)
FROM auth.person_role pr
WHERE
    (h.old_values ? 'valid_till')
    AND NOT (h.old_values ? 'role')
    AND (h.old_values->>'valid_till') IS NULL
    AND (h.new_values->>'valid_till') IS NOT NULL
    AND pr.person_id = h.person_id
    AND pr.valid_till = (h.new_values->>'valid_till')::timestamptz;
--> statement-breakpoint

-- The role_change_trigger used jsonb_diff for UPDATEs, which strips unchanged
-- columns. For a stopRole (only valid_till changes), the role name was lost,
-- so the changelog couldn't show "removed <role>". Fix: always include the
-- role column in UPDATE diffs so the changelog always knows which role changed.
CREATE OR REPLACE FUNCTION auth.role_change_trigger() RETURNS trigger
	LANGUAGE plpgsql AS $$
DECLARE
	v_new jsonb;
	v_old jsonb;
BEGIN
	v_new := public.jsonb_diff(to_jsonb(row_to_json(NEW)), CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END);
	v_old := public.jsonb_diff(CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END, to_jsonb(row_to_json(NEW)));

	IF TG_OP = 'UPDATE' THEN
		v_new := v_new || jsonb_build_object('role', NEW.role);
		v_old := v_old || jsonb_build_object('role', OLD.role);
	END IF;

	INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
	VALUES (
		NULLIF(current_setting('app.user_id', true), '')::INTEGER,
		NEW.person_id,
		NULLIF(current_setting('app.user_role', true), ''),
		current_timestamp,
		v_new,
		v_old
	);
	RETURN NEW;
END; $$;
