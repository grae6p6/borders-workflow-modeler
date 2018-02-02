FROM quay.io/ukhomeofficedigital/nodejs-base:v6.9.1

RUN mkdir -p /app

WORKDIR /app

ADD . /app/

RUN npm install

RUN npm run build

EXPOSE 8080

RUN chmod 755 run.sh

ENTRYPOINT /app/run.sh

