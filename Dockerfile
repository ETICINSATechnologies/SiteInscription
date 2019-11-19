FROM keymetrics/pm2:12-alpine

ADD . /usr/src/app

WORKDIR /usr/src/app/client

RUN npm install
RUN npm run build

WORKDIR /usr/src/app/server

RUN npm install

CMD ["pm2-runtime", "ecosystem.config.js"]