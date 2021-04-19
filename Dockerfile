FROM node:14.16.1-alpine3.10
RUN apk update && apk add bash
RUN mkdir /home/node/bbackend
WORKDIR /home/node/bbackend
COPY . /home/node/bbackend
# COPY package*.json .sequelizerc tsconfig.json ./
RUN npm install
# COPY src ./src
RUN npm run build
RUN ls -a
# ENV NODE_ENV production
EXPOSE 3000
# COPY wait-for-it.sh .