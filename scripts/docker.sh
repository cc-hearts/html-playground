#! /bin/bash


docker rm -f fe-playground

docker rmi -f fe-playground:1.0.0

docker build -t fe-playground:1.0.0 .

docker run -p 4001:8080 --name fe-playground -d fe-playground:1.0.0