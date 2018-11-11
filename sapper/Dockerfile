FROM node:11-alpine

RUN apk add --no-cache --update python build-base \
     && rm -rf /var/cache/apk/*

RUN npm install bcrypt

RUN mkdir /app
WORKDIR /app

COPY package.json /app/package.json

RUN yarn

COPY . /app

CMD yarn run dev -p 80

