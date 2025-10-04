FROM node:20.16.0-alpine
WORKDIR /app

ARG NODE_ENV
# ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

# Install dependencies (include devDependencies only in development)
RUN if [ "$NODE_ENV" = "development" ]; then \
      echo "development"; \
      npm install; \
    else \
      npm ci --omit=dev; \
    fi

COPY . .
COPY scripts/healthcheck.js ./scripts/healthcheck.js

# Run different commands depending on environment
CMD ["npm", "start"]