#!/bin/bash

rm -rf app
mkdir app

cp -r ../.package ./app

sudo docker build -t instant-chat/signaler .