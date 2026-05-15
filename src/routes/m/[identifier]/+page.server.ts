import { fail } from "@sveltejs/kit";
import { eq, and, isNull } from "drizzle-orm";
import { superValidate, setError } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

import { db } from "$lib/server/db";
import { person, personRole } from "$lib/server/schema";
import { withAuditContext } from "$lib/server/audit";
import { PersonSchema } from "$lib/schemas/person";
import { warn } from "$lib/server/log";
import type { Actions, PageServerLoad } from "./$types";
import { where } from "./where";

export const load: PageServerLoad = async (event) => {
  const isBoard = event.locals.user!.roles.includes("board");
  const isSelf =
    event.params.identifier.toLowerCase() ===
    event.locals.user!.name.toLowerCase();

  const found = await db.query.person.findFirst({
    where: where(event.params.identifier),
    with: {
      roles: true,
    },
  });

  if (!found) {
    const form = await superValidate(zod4(PersonSchema));
    return { person: null, roles: [], isBoard, isSelf, form };
  }

  const { roles, ...personData } = found;

  const redacted = {
    ...personData,
    bankaccount: isBoard || isSelf ? personData.bankaccount : null,
    key_code: isBoard ? personData.key_code : null,
    note: isBoard || isSelf ? personData.note : null,
  };

  // Prefill the form with the current person's values so the UI starts in sync.
  const form = await superValidate(redacted, zod4(PersonSchema), {
    errors: false,
  });
  return { person: redacted, roles, isBoard, isSelf, form };
};

const SELF_EDITABLE = new Set([
  "email",
  "phone",
  "address",
  "zipcode",
  "city",
  "country",
  "bankaccount",
  "password",
]);

export const actions: Actions = {
  edit: async (event) => {
    const isBoard = event.locals.user!.roles.includes("board");
    const isSelf =
      event.params.identifier.toLowerCase() ===
      event.locals.user!.name.toLowerCase();
    if (!isBoard && !isSelf) return fail(403);

    const form = await superValidate(event, zod4(PersonSchema));
    if (!form.valid) return fail(400, { form });

    const [existing] = await db
      .select()
      .from(person)
      .where(where(event.params.identifier))
      .limit(1);
    if (!existing) return fail(404);

    // Diff against existing — only ship changed columns through audit context.
    const updates: Partial<typeof person.$inferInsert> = {};
    for (const [key, next] of Object.entries(form.data)) {
      if (!isBoard && !SELF_EDITABLE.has(key)) continue;
      if (next === undefined) continue;
      const col = key as keyof typeof existing;
      if (key === "password" && next === null) continue; // empty password = keep
      const prev = existing[col] ?? null;
      if (next !== prev) (updates as Record<string, unknown>)[key] = next;
    }

    if (!Object.keys(updates).length) return { form };

    try {
      await withAuditContext(event, (tx) =>
        tx.update(person).set(updates).where(eq(person.id, existing.id)),
      );
    } catch (err) {
      const pgErr = err as { code?: string };
      if (pgErr.code === "23505") {
        return setError(form, "email", "already in use");
      }
      warn("m/[identifier]: unexpected db error on edit", { err });
      throw err;
    }
    return { form };
  },

  addRole: async (event) => {
    const isBoard = event.locals.user!.roles.includes("board");
    if (!isBoard) return fail(403);

    const formData = await event.request.formData();
    const personId = parseInt(formData.get("personId") as string);
    const role = formData.get("role") as string;

    if (!personId || !role) return fail(400);

    const existing = await db
      .select()
      .from(personRole)
      .where(
        and(
          eq(personRole.person_id, personId),
          eq(personRole.role, role),
          isNull(personRole.valid_till),
        ),
      );

    if (existing.length) return { success: true };

    await withAuditContext(event, (tx) =>
      tx.insert(personRole).values({ person_id: personId, role }),
    );
    return { success: true };
  },

  stopRole: async (event) => {
    const isBoard = event.locals.user!.roles.includes("board");
    if (!isBoard) return fail(403);

    const formData = await event.request.formData();
    const roleId = parseInt(formData.get("roleId") as string);

    if (!roleId) return fail(400);

    await withAuditContext(event, (tx) =>
      tx
        .update(personRole)
        .set({ valid_till: new Date() })
        .where(eq(personRole.id, roleId)),
    );
    return { success: true };
  },
};
