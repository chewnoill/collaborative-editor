FROM node:14

WORKDIR /editor

COPY package.json /editor/package.json
COPY yarn.lock /editor/yarn.lock
RUN yarn install
