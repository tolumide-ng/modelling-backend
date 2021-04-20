FROM node:14.16.1-alpine3.10
RUN apk update && apk add bash
RUN mkdir /home/node/bbackend
WORKDIR /home/node/bbackend
COPY . /home/node/bbackend
RUN npm install
RUN npm run build
RUN ls -a
EXPOSE 3000