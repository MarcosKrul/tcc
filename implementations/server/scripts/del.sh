#!/usr/bin/bash

pm2 del http-server-async
pm2 del http-server-async-cluster
pm2 del http-server-sync