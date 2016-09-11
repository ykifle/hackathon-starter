#!/bin/bash
cloneNum=$RANDOM
echo $cloneNum
node clone.js $cloneNum
sleep 2
docker run --volume-driver netapp -v clone$cloneNum:/clone turboestate
sleep 2
docker volume rm clone$RANDOM