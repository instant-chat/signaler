#!/bin/bash

wrk -c 1000 -d 5 -t 8 https://localhost:2999/stats