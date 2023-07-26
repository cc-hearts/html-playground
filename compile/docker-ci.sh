#!/bin/bash
docker rm -f nest-playground
docker rmi -f nest-playground:1.0.0

docker build -t nest-playground:1.0.0 .

docker run -p 30083:30083 --name nest-playground -d nest-playground:1.0.0