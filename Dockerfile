
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

#idk why but git is needed for yarn??
RUN apk add git 

RUN yarn install --production --frozen-lockfile

COPY . .

CMD ["yarn", "start"]

