FROM node:lts

WORKDIR /usr/app

COPY index.js .

CMD ["node", "index.js"]