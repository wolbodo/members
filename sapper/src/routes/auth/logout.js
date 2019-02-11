
const {
  GRAPHQL_LOCAL_URI,
  COOKIE_DOMAIN = 'wolbodo.nl',
  COOKIE_SECURE = true
} = process.env

export function get (req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Set-Cookie': `token=deleted; Domain=${
                    COOKIE_DOMAIN
                  }; Path=/; ${
                    (COOKIE_SECURE === 'true')
                      ? 'Secure;'
                      : ''
                  } HttpOnly; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  })
  console.log('Logging out user...')
  res.end(JSON.stringify({
    ok: true
  }))
}
