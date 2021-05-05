#!/bin/sh
cd /shared/docker
docker-compose down
docker pull dacollins/ethisim:frontend-landing-page 
docker pull dacollins/ethisim:frontend-editor
docker pull dacollins/ethisim:frontend-simulator
docker pull dacollins/ethisim:backend-editor
docker pull dacollins/ethisim:backend-simulator
docker rmi docker_production:latest
docker-compose up -d
yes | docker system prune -a --filter "until=168h"
exit
exit -N
