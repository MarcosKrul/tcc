#!/usr/bin/bash

pm2 start src/http-server-async.js --name async
pm2 start src/http-server-async-cluster.js --name async-c
pm2 start src/http-server-sync.js --name sync