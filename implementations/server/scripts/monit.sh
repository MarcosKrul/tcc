#!/bin/bash

js_file_name="src/http-server-async-cluster.js"  

node "$js_file_name" &
node_pid=$!

echo $node_pid

log_file="memory_cpu_usage.log"

while ps -p $node_pid > /dev/null; do
  timestamp=$(date +'%Y-%m-%d %H:%M:%S')
  usage_info=$(ps -p $node_pid -o rss,%mem,%cpu --no-headers)

  if [ -n "$usage_info" ]; then
    
    rss_mb=$(echo "$usage_info" | awk '{printf "%.2f", $1/1024}')
    memory_usage=$(echo "$usage_info" | awk '{printf "%.2f", $2}')
    cpu_usage=$(echo "$usage_info" | awk '{printf "%.2f", $3}')
    echo "$timestamp;$rss_mb MB;CPU: $cpu_usage%" >> "$log_file"
  else
    echo "Processo Node.js não encontrado."
    exit 1
  fi

  sleep 1
done