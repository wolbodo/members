import type { RequestHandler } from '@sveltejs/kit';

import type { Locals } from '$lib/types';
import { serverToken, verifyToken } from '$lib/jwt'
import { client, token, gql } from '$lib/graphql'

// The verify endpoint is called when nginx wants to authenticate an [auth_request](http://nginx.org/en/docs/http/ngx_http_auth_request_module.html)

export const get: RequestHandler<Locals, FormData> = async (request) => {
  console.log("verify", request)


  return { status: 401, body: {} }
}