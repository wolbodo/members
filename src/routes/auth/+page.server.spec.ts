import { describe, expect, it } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";

import { actions } from "./+page.server";

describe('auth actions', () => {
  describe('login', () => {
    it.todo('should fail on wrong password')
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