FROM node:wheezy
WORKDIR /clone/turboestate
CMD ["cd","/clone/turboestate"]
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]
CMD ["npm","install"]
CMD ["npm","install","-g","mocha"]
EXPOSE 3000
EXPOSE 8082

