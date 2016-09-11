npm install -g mocha
mongod  --dbpath /clone/mongodata --port 8082 & >  /tmp/log.txt 2>&1
mocha
