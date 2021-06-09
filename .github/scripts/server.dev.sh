#!/bin/sh
cd /ethisim
docker-compose down
docker pull ikhurana/ethisim-dev:frontend-landing-page 
docker pull ikhurana/ethisim-dev:frontend-editor
docker pull ikhurana/ethisim-dev:frontend-simulator
docker pull ikhurana/ethisim-dev:backend-editor
docker pull ikhurana/ethisim-dev:backend-simulator
docker rmi ethisim_production:latest
docker-compose up -d
yes | docker system prune -a --filter "until=168h"
exit
exit -N
