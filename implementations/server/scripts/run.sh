#!/bin/bash

PORT=$1
FILE=$2

THREADS=$(nproc)

rm -rf "./tmp/${FILE}.json" &&
rm -rf "./tmp/analytics-${FILE}.json" &&
seq 1 $((${THREADS} * 3)) | xargs -Iname -P ${THREADS} curl -X GET "http://localhost:${PORT}"
echo "Done"