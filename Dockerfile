FROM quay.io/ukhomeofficedigital/nodejs-base:v8.9.4

RUN mkdir -p /app
WORKDIR /app
ADD . /app/
RUN npm install && npm run build
ENV NODE_ENV='production'

EXPOSE 8080

RUN chmod 755 run.sh

ENTRYPOINT exec node dist/server.js

