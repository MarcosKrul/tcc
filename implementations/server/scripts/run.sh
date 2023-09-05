#!/bin/bash

PORT=$1
FILE=$2
PYTHON_FILE=$3

rm -rf "./tmp/${FILE}.json" &&
rm -rf "./tmp/analytics-${FILE}.json" &&
seq 1 10 | xargs -Iname -P $(nproc) curl -X GET "http://localhost:${PORT}" &&
python3 "./../python/src/${PYTHON_FILE}.py" $FILE
echo "Done"