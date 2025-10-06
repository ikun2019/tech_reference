FROM node:20.16.0-alpine
WORKDIR /app

COPY package*.json ./

# Install dependencies (include devDependencies only in development)
RUN npm install

COPY . .
COPY scripts/healthcheck.js ./scripts/healthcheck.js

# Run different commands depending on environment
CMD ["npm", "start"]