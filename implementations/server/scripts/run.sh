#!/bin/bash

PORT=$1
seq 1 10 | xargs -Iname -P4  curl -k -X GET "http://localhost:${PORT}"
echo "Done"