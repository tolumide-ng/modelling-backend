FROM node:14.16.1-alpine3.10
USER node
RUN mkdir /home/node/mbackend
WORKDIR /home/node/mbackend
COPY --chown=node:node package*.json .sequelizerc tsconfig.json ./
RUN npm install
COPY --chown=node:node src ./src
# COPY . .
RUN ls -a
RUN npm run build
ENV NODE_ENV production
EXPOSE 3000
COPY wait-for-it.sh .
