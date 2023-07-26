FROM node:latest as base-node

LABEL maintainer="heart<7362469@qq.com>"

WORKDIR /usr/transform-playground

COPY . .

RUN rm -rf node_modules

RUN npm config set registry https://registry.npm.taobao.org

RUN npm i

EXPOSE 30083

CMD npm run start

