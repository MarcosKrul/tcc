#!/usr/bin/bash

pm2 start src/http-server-async.js
pm2 start src/http-server-sync.js