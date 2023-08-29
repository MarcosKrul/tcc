#!/bin/bash

PORT=$1

start_time=$(date +%s.%N)

curl "http://localhost:${PORT}"

end_time=$(date +%s.%N)    

elapsed_time=$(echo "$end_time - $start_time" | bc)

echo "O comando levou $elapsed_time segundos para ser executado."