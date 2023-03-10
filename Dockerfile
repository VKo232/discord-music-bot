# FROM node:18-slim
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

#idk why but git is needed for yarn??
# RUN apt-get update && apt-get install -y git
RUN apk update && apk add git

# RUN apk add git 
RUN yarn install --production --frozen-lockfile --no-cache

COPY . .

CMD ["yarn", "start"]