import { describe, expect, it } from "vitest";
import { fail, type RequestEvent } from "@sveltejs/kit";

import { actions } from "./+page.server";
import type { RouteParams } from "./$types";

// const request = ({ state, locals, params, request, route, headers, url, is_data_request }): RequestEvent => ()


const requestEvent = (request, { locals, params } = {}): RequestEvent<RouteParams, '/auth'> => {
  let url = new URL(request.url);
  return {
    // @ts-expect-error `cookies` and `fetch` need to be created after the `event` itself
    cookies: null,
    // @ts-expect-error
    fetch: null,
    locals,
    params,
    request,
    url,
  }
}

describe('auth actions', () => {
  describe('login', () => {
    it.skip('should fail on wrong password', async () => {
      const formData = new FormData()
      const request = new Request('http://localhost/auth?login', { method: 'POST', body: formData })
      const event = requestEvent(request)
      const response = await actions.login(event)
      console.log('done')
      expect(response).toBe(fail(400))
    })
    it.todo('should redirect to /')
    it.todo('should set the cookie')
  })

  describe('logout', () => {
    it.todo('should delete the cookie')
    it.todo('should redirect')
  })
  describe('forgot', () => {
    it.todo('sends an email if the user exists')
    it.todo('fails when no email is supplied')
    it.todo('fails silently when a wrong email is supplied')
  })
})