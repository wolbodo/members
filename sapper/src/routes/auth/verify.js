
import { verify } from 'src/lib/jwt'

/*
  # Verifies cookie in request for nginx's auth_request module

  - if token is valid -> 200
  - if token is invalid -> 302 -> members.wlbd.nl/login
*/

export async function get (req, res) {
  try {
    const t = await verify(req.token)
    console.log("verify ok", t)
    res.writeHead(200)
    res.end()
  } catch (e) {
    console.log("verify fail", e)
    res.writeHead(401)
    res.end()
  }

}