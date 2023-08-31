#!/usr/bin/bash

pm2 restart http-server-async
pm2 restart http-server-async-cluster
pm2 restart http-server-sync