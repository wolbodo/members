FROM node:alpine

COPY build /app

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn --production --pure-lockfile
