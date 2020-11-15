const http = require("http");
const { postgraphile } = require("postgraphile");


http
  .createServer(
    postgraphile(process.env.DATABASE_URL, "auth", {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      appendPlugins: [
        require("@graphile-contrib/pg-simplify-inflector"),
        require("postgraphile-plugin-connection-filter")
      ],
    })
  )
  .listen(process.env.PORT);