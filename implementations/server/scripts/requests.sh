#!/bin/bash

num_requests=10

url="http://localhost:3001"

for ((i = 1; i <= num_requests; i++)); do
  curl -s -o /dev/null -w "Request $i: %{http_code}\n" "$url" &
done

wait

echo "Todas as solicitações foram concluídas."