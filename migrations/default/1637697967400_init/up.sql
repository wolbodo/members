SET check_function_bodies = false;
CREATE FUNCTION public.jsonb_diff(new jsonb, old jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  result JSONB;
  v RECORD;
BEGIN
   result = new;
   FOR v IN SELECT * FROM jsonb_each(old) LOOP
     IF result @> jsonb_build_object(v.key,v.value)
        THEN result = result - v.key;
     ELSIF result ? v.key THEN CONTINUE;
     ELSE
        result = result || jsonb_build_object(v.key,'null');
     END IF;
   END LOOP;
   RETURN result;
END;
$$;
