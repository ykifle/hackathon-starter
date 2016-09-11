FROM node:wheezy
WORKDIR /clone/turboestate
RUN apt-get update && apt-get install -y mongodb
CMD ["cd","/clone/turboestate"]
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]
CMD ["npm","install"]
CMD ["npm","install","-g","mocha"]
CMD ["sh","runtest.sh"]
EXPOSE 3000
EXPOSE 8082
