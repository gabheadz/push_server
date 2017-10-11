FROM node:latest
MAINTAINER Gabriel Martinez <gabriel.martinez@proteccion.com.co>

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
