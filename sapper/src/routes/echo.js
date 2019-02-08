

export function post (req, res) {
  console.log("Got echo post", JSON.stringify(req))

  res.writeHead(500, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(req))
}

export function get (req, res) {
  console.log("Got echo post", JSON.stringify(req))

  res.writeHead(500, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(req))
}