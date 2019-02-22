
import { verifyToken } from 'src/lib/jwt'

/*
  # Verifies cookie in request for nginx's auth_request module

  - if token is valid -> 200
  - if token is invalid -> 302 -> members.wlbd.nl/login
*/

export async function get (req, res) {
  try {
    if (!req.token) {
      console.error('no token')
      res.writeHead(401)
      res.end()
    }
    const t = await verifyToken(req.token)

    res.writeHead(200, {
      'X-User': t.name,
      'X-Email': t.email
    })
    res.end()
  } catch (e) {
    console.error('verify fail', e)
    res.writeHead(401)
    res.end()
  }
}
