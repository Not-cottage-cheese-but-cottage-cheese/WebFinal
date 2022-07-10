FROM node:lts-alpine3.16 as build-stage

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 3005
CMD ["nginx", "-g", "daemon off;"]