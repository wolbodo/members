FROM node:alpine

WORKDIR /app

ADD package.json yarn.lock .npmrc /app/

RUN yarn install --prod --pure-lockfile && yarn cache clean

ADD . /app/

EXPOSE 80/tcp

ENV PORT 80
ENV NODE_ENV 'production'

CMD ["node", "__sapper__/build"]
