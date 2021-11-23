FROM node:alpine

COPY build /app

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm ci
