#!/bin/bash

rm -rf app
mkdir app
mkdir app/node_modules

cp -r #list used node_modules directories
      #need to figure out how to automate and strip unnecessary files
      #need server-side 'browserify'
      #may have that solution somehwere...
      # ../node_modules/koa \
      # ../node_modules/koa.io \
      # ../node_modules/koa-gzip \
      # ../node_modules/koa-logger \
      # ../node_modules/koa-onerror \
      # ../node_modules/koa-parse-json \
      # ../node_modules/koa-route \
      # ../node_modules/koa-send \
      # ../node_modules/lodash \
      # ../node_modules/promise-callback \
      # ../node_modules/tail \
      ./app/node_modules/

cp -r ../.dist ./app

sudo docker build -t #containername# .
sudo docker push #containername#