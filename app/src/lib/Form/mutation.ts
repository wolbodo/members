
import { client } from '$lib/graphql'

export function mutation(
  form: HTMLFormElement, {
    mutation, role, error, result, pending
  }: {
    mutation: gql;
    role?: string;
    pending?: (data: FormData, form: HTMLFormElement) => void;
    error?: (res: Response, error: Error, form: HTMLFormElement) => void;
    result?: (res: Response, form: HTMLFormElement) => void;
  }
) {
  let current_token: {};

  async function handle_submit(e: Event) {
    const token = (current_token = {});

      e.preventDefault();

    const body = new FormData(form)
    const formdata = Object.fromEntries(
      Array.from(body.entries())
        .filter(
          ([name,]) => form[name].classList.contains('changed')
        )
    )
    console.log(formdata)

    const result = await client.request(mutation, { formdata }, role && { 'X-Hasura-Role': role })

    console.log(result)
    
  }

  form.addEventListener('submit', handle_submit);

  return {
    destroy() {
      form.removeEventListener('submit', handle_submit);
    }
  };
}