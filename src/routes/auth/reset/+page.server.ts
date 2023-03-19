import { fail, redirect } from '@sveltejs/kit';

import { graphql } from '$houdini';

import { serverToken, verifyToken } from '$lib/jwt';
import type { Actions } from './$types';

const changePassword = graphql(`
mutation changePassword($id:Int!, $password:String!){
  update_auth_person(where:{id:{_eq:$id}}, _set:{
    password:$password
  }) {
    affected_rows
  }
}`)

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const password = data.get('password')
    const resetToken = data.get('token')

    if (!(password && resetToken)) {
      return fail(400);
    }
    const { sub, id } = await verifyToken(resetToken)

    if (sub !== 'password-reset') return fail(400)

    changePassword.mutate({ id: parseInt(id), password }, {
      event,
      metadata: { token: serverToken('password-reset', id) }
    })

    throw redirect(302, '/')
  }
} satisfies Actions;