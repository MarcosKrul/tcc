#!/bin/bash

PORT=$1
FILE=$2

rm -rf "./tmp/${FILE}.json" &&
rm -rf "./tmp/analytics-${FILE}.json" &&
seq 1 10 | xargs -Iname -P $(nproc) curl -X GET "http://localhost:${PORT}"
echo "Done"