FROM node:lts-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm i -g @nestjs/cli

RUN npm run build

FROM node:lts-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=optional --omit=dev --production

COPY --from=base /app/dist ./dist

EXPOSE 8000

# Define the command to run your NestJS application in production
CMD [ "node", "dist/main.js" ]
