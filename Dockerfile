FROM node:14.17-alpine

RUN apk update && apk upgrade

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --production

COPY src /app

CMD [ "npm", "start" ]
