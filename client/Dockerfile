### STAGE 1: Build ###
FROM node:8.15-alpine
RUN mkdir -p /usr/src/site_inscription
COPY . /usr/src/site_inscription
WORKDIR /usr/src/site_inscription
RUN npm run build


### STAGE 2: Serve ###
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
