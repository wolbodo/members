# Members

Postgres + Postgraphile + svelte
## Running the backend:

- Install docker and docker-compose (v1.29)
- Install yarn `sudo npm i -g yarn`
- Copy .env.template to .env and fill it in.
  - Make sure the `AUTH_JWT_SECRET` has a key property of at least 32 characters
- Move or copy db/sample/10.fixtures.sql to db/init/10.fixtures.sql
- docker network create wolbodo
- If you'd like you can setup [docker-hostmanager](https://github.com/iamluc/docker-hostmanager#usage)
  Otherwise you'd have to configure ip's in you hosts file

- install docker and docker-compose
- $: docker-compose build
- $: docker-compose up graphql

And connect to http://localhost:8080/graphiql in the browser or http://localhost:8080/graphql
