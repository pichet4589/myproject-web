#!bin/bash

NAME="${PWD##*/}"
docker build -t $NAME .