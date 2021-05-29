export async function post(req, res) {
  // Proxy requests to hasura
  // const token = req.session.token;
  // console.log("token:", token);
  const response = await fetch("http://graphql/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      // Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(req.body),
  });

  res.writeHead(response.status, {
    "Content-Type": "application/json",
  });
  res.end(await response.text());
}
