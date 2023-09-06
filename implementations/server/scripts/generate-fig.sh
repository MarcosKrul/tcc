#!/bin/bash

FILE=$1
PYTHON_FILE=$2

python3 "./../python/src/${PYTHON_FILE}.py" $FILE &&
cp -r ./tmp/${FILE}/${FILE}_*.png "./../../article/images/pt-br/results/"