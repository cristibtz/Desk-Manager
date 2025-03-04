# build environment
FROM node:22.13.1-alpine AS build

WORKDIR /desk-manager-frontend

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . ./
