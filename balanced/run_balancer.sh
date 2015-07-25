#!/bin/bash

docker run -i -t \
  -v $(pwd)/nginx-wss-proxy.conf:/etc/nginx/nginx.conf \
  -v $(pwd)/../../debug/secrets/debug-localhost:/secrets \
  -p 3003:80 \
  -p 3002:3000 \
  -p 2999 \
  nginx