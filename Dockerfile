FROM nginx:latest

LABEL maintainer="heart<7362469@qq.com>"

COPY dist/ /opt/fe-playground/

COPY default.conf /etc/nginx/conf.d/default.conf
