

export function post (req, res) {
  console.log("Got echo call", req.headers)

  res.writeHead(500, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({
    headers: req.headers
  }))
}