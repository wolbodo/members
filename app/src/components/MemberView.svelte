<script>
  import { derived } from "svelte/store";
  import gql from "graphql-tag";
  import { Sveltik, Form, Field, ErrorMessage } from "sveltik";

  import { query } from "svelte-apollo";

  export let id;

  const getMember = query(
    gql`
      query getMemberById($id: Int!) {
        personById(id: $id) {
          id
          name
          email
          phone
          zipcode
          address
          city
          country
          created
          note
        }
      }
    `,
    {
      variables: { id },
    }
  );

  const member = derived(
    getMember,
    ({ loading, error, data: { personById: node } = { personById: null } }) =>
      !loading && !error && node
  );

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };
  const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };
</script>

{#if $getMember.loading}
  <h1>...waiting on member</h1>
{:else if $getMember.error}
  <p style="color: red">{$getMember.error}</p>
{:else}
  <h1>{$member.name}</h1>

  <Sveltik
    initialValues={$member}
    {validate}
    {onSubmit}
    let:isSubmitting
    let:isDirty
  >
    <Form class="form">
      <label for="name">Name:</label>
      <Field id="name" name="name" />
      <ErrorMessage name="name" as="div" class="error" />

      <label for="email">Email:</label>
      <Field id="email" name="email" type="email" />
      <ErrorMessage name="email" as="div" class="error" />

      <label for="phone">Phone:</label>
      <Field id="phone" name="phone" />
      <ErrorMessage name="phone" as="div" class="error" />

      <label for="zipcode">Zipcode:</label>
      <Field id="zipcode" name="zipcode" />
      <ErrorMessage name="zipcode" as="div" class="error" />

      <label for="address">Address:</label>
      <Field id="address" name="address" />
      <ErrorMessage name="address" as="div" class="error" />

      <label for="city">City:</label>
      <Field id="city" name="city" />
      <ErrorMessage name="city" as="div" class="error" />

      <label for="country">Country:</label>
      <Field id="country" name="country" />
      <ErrorMessage name="country" as="div" class="error" />

      <label for="created">Created:</label>
      <Field id="created" name="created" />
      <ErrorMessage name="created" as="div" class="error" />

      <label for="note">Note:</label>
      <Field id="note" name="note" />
      <ErrorMessage name="note" as="div" class="error" />

      <button type="submit" disabled={isSubmitting || !isDirty}>Submit</button>
      <pre>{isDirty}</pre>
    </Form>
  </Sveltik>

  <pre>{JSON.stringify($member, null, 2)}</pre>
{/if}

<style>
  :global(.form) {
    display: grid;
    grid-template-columns: auto auto;
  }

  :global(.form > .error) {
    grid-column-end: span 2;
  }

  :global(.form input) {
    border: none;
    background: #ffa5002e;
    font-size: 1.2rem;
    padding: 0.3rem;
    color: white;
    border-bottom: 1px solid orange;
  }

  h1,
  label {
    color: white;
  }
</style>
