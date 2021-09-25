FROM node:lts as base

WORKDIR /usr/app

# SOURCES
FROM base as sources

COPY yarn.lock .
COPY package.json .

RUN yarn install --production=false

# BUILD
FROM sources as build

COPY tsconfig.json .
COPY tsconfig.build.json .
COPY src src

RUN yarn build

# DEPENDENCIES
FROM sources as dependencies

RUN yarn install --frozen-lockfile --force --production --ignore-scripts --prefer-offline

# RELEASE
FROM base as release

COPY --from=dependencies --chown=node:node /usr/app/node_modules/ /usr/app/node_modules/
COPY --from=build --chown=node:node /usr/app/dist/ /usr/app/dist/

RUN mkdir /usr/app/conf.d

USER node

CMD ["node", "dist/index.js"]
