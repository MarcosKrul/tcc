#!/bin/bash

FILE=$1

SERVER_FILE_NAME="src/http-server-${FILE}.js"  

node "$SERVER_FILE_NAME" &
node_pid=$!

LOG_DIRECTORY="tmp/${FILE}"
rm -rf $LOG_DIRECTORY/*.csv
rm -rf $LOG_DIRECTORY/*.json
rm -rf $LOG_DIRECTORY/*.png
LOG_FILE="memory_cpu_usage.csv"

rm $LOG_FILE

while ps -p $node_pid > /dev/null; do
  timestamp=$(date +'%Y-%m-%d %H:%M:%S')
  usage_info=$(ps -p $node_pid -o rss,%cpu --no-headers)

  if [ -n "$usage_info" ]; then
    rss_mb=$(echo "$usage_info" | awk '{printf "%.2f", $1/1024}')
    cpu_usage=$(echo "$usage_info" | awk '{printf "%.2f", $2}')
    echo "$timestamp;$rss_mb;$cpu_usage" >> "$LOG_DIRECTORY/$LOG_FILE"
  else
    echo "Processo Node.js não encontrado."
    exit 1
  fi

  sleep 1
done