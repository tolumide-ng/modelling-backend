FROM node:14.16.1-alpine3.10
RUN mkdir /home/node/modelling && chown -R node:node /home/node/modelling
WORKDIR /home/node/modelling
COPY --chown=node:node package*.json .sequelizerc tsconfig.json ./
RUN npm install
COPY --chown=node:node src ./src
USER node
# COPY . .
RUN ls -a
RUN npm run build
ENV NODE_ENV production
EXPOSE 3000
COPY wait-for-it.sh .
