import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { personRole } from "$lib/server/schema";

export const load: PageServerLoad = async ({ url, locals }) => {
  const showAll = url.searchParams.has("all");

  const now = new Date();

  const people = await db.query.person.findMany({
    where: (person, { exists, and, eq, isNull, lte }) => {
      if (showAll) return undefined;
      return exists(
        db
          .select()
          .from(personRole)
          .where(
            and(
              eq(personRole.person_id, person.id),
              eq(personRole.role, "member"),
              isNull(personRole.valid_till),
              lte(personRole.valid_from, now),
            ),
          ),
      );
    },
    with: {
      roles: {
        where: (role, { and, isNull, lte }) =>
          and(isNull(role.valid_till), lte(role.valid_from, now)),
      },
    },
    orderBy: (person, { asc }) => [asc(person.name)],
  });

  return {
    people: people.map((p) => ({
      ...p,
      roles: [...new Set(p.roles.map((r) => r.role))],
    })),
    user: locals.user,
  };
  j;
};
