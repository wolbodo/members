FROM node:11-alpine

RUN apk add --no-cache --update python build-base \
     && rm -rf /var/cache/apk/*

RUN mkdir /app
WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install

COPY . /app

CMD yarn run dev -p 80

