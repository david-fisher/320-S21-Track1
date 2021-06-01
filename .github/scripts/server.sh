#!/bin/sh
cd /shared/docker
docker-compose down
docker pull ikhurana/ethisim-prod:frontend-landing-page 
docker pull ikhurana/ethisim-prod:frontend-editor
docker pull ikhurana/ethisim-prod:frontend-simulator
docker pull ikhurana/ethisim-prod:backend-editor
docker pull ikhurana/ethisim-prod:backend-simulator
docker rmi docker_production:latest
docker-compose up -d
yes | docker system prune -a --filter "until=168h"
exit
exit -N
