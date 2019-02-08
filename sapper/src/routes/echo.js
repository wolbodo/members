

export function post (req, res) {
  const body = JSON.stringify({
    method: req.method,
    headers: req.headers,
    body: req.body
  })
  console.log("Got echo post", body)
  res.writeHead(500, {
    'Content-Type': 'application/json'
  })
  res.end(body)
}

export function get (req, res) {
  const body = JSON.stringify({
    method: req.method,
    headers: req.headers,
    body: req.body
  })
  console.log("Got echo post", body)

  res.writeHead(500, {
    'Content-Type': 'application/json'
  })
  res.end(body)
}