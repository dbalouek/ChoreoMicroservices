#!/bin/bash

# installs docker
sudo yum install docker-ce

# installs docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# starts the docker services
sudo systemctl enable docker

# downloads the three required images
sudo docker pull node
sudo docker pull nginx
sudo docker pull mongo

# builds and runs the containers
sudo docker-compose build
sudo docker-compose up -d