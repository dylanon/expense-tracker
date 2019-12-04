FROM node:12
WORKDIR /api
COPY . /api
EXPOSE ${API_PORT}
CMD yarn && yarn migrate:latest && yarn ${API_START_COMMAND:-start}
