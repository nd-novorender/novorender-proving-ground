FROM node:19 AS build

# Install
COPY ./package*.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm ci
# Build
COPY . /usr/src/app/
RUN npm run build

FROM pierrezemb/gostatic
COPY ./headerConfig.json /config/
COPY --from=build /usr/src/app/dist/ /srv/http/