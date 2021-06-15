
import { client } from '$lib/graphql'

export function mutation(
  form: HTMLFormElement, {
    mutation, role, variables, error, result, pending
  }: {
    mutation: gql;
    role?: string;
    variables?: object;
    pending?: (data: FormData, form: HTMLFormElement) => void;
    error?: (res: any, error: Error, form: HTMLFormElement) => void;
    result?: (res: any, form: HTMLFormElement) => void;
  }
) {
  let current_token: {};
  let initialState = Object.fromEntries(
    (new FormData(form)).entries()
  )

  async function handle_submit(e: Event) {
      e.preventDefault(); e.stopPropagation();

    const body = new FormData(form)
    const formdata = Object.fromEntries(
      Array.from(body.entries())
        .filter(
          ([name,value]) => initialState[name] !== value
        )
    )

		if (pending) pending(body, form);

		try {
      const response = await client.request(mutation, { formdata, ...variables }, role && { 'X-Hasura-Role': role })

      result(response, form);

		} catch (e) {
      if (error) {
        console.error(e)
				error(null, e, form);
			} else {
				throw e;
			}
		}
  }

  form.addEventListener('submit', handle_submit);

  return {
    destroy() {
      form.removeEventListener('submit', handle_submit);
    }
  };
}