FROM node:20.16.0-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY scripts/healthcheck.js ./scripts/healthcheck.js

EXPOSE 8010

CMD ["npm", "run", "start"]