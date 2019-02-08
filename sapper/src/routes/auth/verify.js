
/*
  # Verifies cookie in request for nginx's auth_request module

  - if token is valid -> 200
  - if token is invalid -> 302 -> members.wlbd.nl/login
*/

export function get (req, res) {
  const body = JSON.stringify({
    method: req.method,
    headers: req.headers,
    body: req.body
  })
  console.log("Got echo get", body)

  res.writeHead(302, {
    Location: 'https://members.wlbd.nl/login'
  })
  res.end()
}