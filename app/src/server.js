import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import bodyParser from "body-parser";
import crossFetch from "cross-fetch";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

global.fetch = (url, opts) => {
  if (url[0] === "/") url = `http://localhost:${PORT}${url}`;
  return crossFetch(url, opts);
};

polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    bodyParser.json(),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
