#!/bin/bash

docker run -i -t \
  -v $(pwd)/nginx-wss-proxy.conf:/etc/nginx/nginx.conf \
  -v $(pwd)/../../debug/secrets/debug-localhost:/secrets \
  -p 3006:80 \
  -p 3007:443 \
  -p 2999 \
  -p 3000 \
  nginx