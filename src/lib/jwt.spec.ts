import { vi, describe, it, vitest, expect } from 'vitest'
import { createToken, parseToken, serverToken, verifyToken } from './jwt'

vi.mock('$env/static/private', () => ({
  AUTH_JWT_SECRET_KEY: 'test'
}))

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time))

describe('jwt', () => {
  const subject = 'test'
  const id = '0'


  it('creates token', () => {
    const token = createToken({ id }, { subject })
    expect(verifyToken(token))
  })
  it('parses token', () => {
    const parsed = parseToken(createToken({ id }, { subject }))

    expect(parsed.id).toBe(id)
    expect(parsed.sub).toBe(subject)
    expect(parsed.iss).toBe('auth')
    expect(parsed.exp - parsed.iat).toBe(24 * 60 * 60) // Default 1 day
  })
  it('verify fails expired tokens', async () => {
    const token = createToken({ id }, { subject, expiresIn: '1s' })

    await wait(1100)

    await expect(verifyToken(token))
      .rejects
      .toThrow('jwt expired')
  })
})