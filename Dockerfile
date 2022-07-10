FROM node:lts-alpine3.16

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./

CMD ["yarn", "start"]