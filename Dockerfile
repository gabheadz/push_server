FROM node:latest
MAINTAINER Gabriel Martinez <gabrieljm@gmail.com>

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
