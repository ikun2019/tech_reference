FROM node:20.16.0-alpine
WORKDIR /app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "development" ]; then \
      echo "development"; \
      npm install; \
    else \
      npm ci --omit=dev; \
    fi
    
COPY . .
COPY scripts/healthcheck.js ./scripts/healthcheck.js

EXPOSE 8020

CMD ["npm", "run", "start"]