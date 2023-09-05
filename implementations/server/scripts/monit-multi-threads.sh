#!/bin/bash

FILE=$1

SERVER_FILE_NAME="src/http-server-${FILE}.js"   

node "$SERVER_FILE_NAME" &
node_pid=$!

LOG_DIRECTORY="tmp/${FILE}"
rm -rf $LOG_DIRECTORY/*.csv
rm -rf $LOG_DIRECTORY/*.json
rm -rf $LOG_DIRECTORY/*.png

while true; do
  worker_pids=$(pgrep -P $node_pid)
  timestamp=$(date +'%Y-%m-%d %H:%M:%S')

  for worker_pid in $worker_pids; do
    worker_name="worker_$worker_pid"
    usage_info=$(ps -p $worker_pid -o rss,%cpu --no-headers)

    if [ -n "$usage_info" ]; then
      rss_mb=$(echo "$usage_info" | awk '{printf "%.2f", $1/1024}')
      cpu_usage=$(echo "$usage_info" | awk '{printf "%.2f", $2}')
      echo "$timestamp;$rss_mb;$cpu_usage" >> "$LOG_DIRECTORY/memory_cpu_usage-$worker_name.csv"
    fi
  done

  sleep 1
done
