FROM node:latest

LABEL maintainer="heart<7362469@qq.com>"

WORKDIR /opt/html-playground


COPY .output/ ./.output/

COPY package.json ./

RUN rm -rf node_modules

RUN npm config set registry https://registry.npm.taobao.org

RUN npm i

CMD PORT=8080 node ./.output/server/index.mjs