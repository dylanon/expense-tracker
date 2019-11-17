FROM node:12-alpine
WORKDIR /api
COPY . /api
EXPOSE ${API_PORT}
RUN yarn
CMD yarn start