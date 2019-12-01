FROM node:12
WORKDIR /api
COPY . /api
EXPOSE ${API_PORT}
CMD yarn && yarn ${API_START_COMMAND:-start}
