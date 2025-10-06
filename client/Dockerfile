FROM node:20.16.0-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Install dependencies (include devDependencies only in development)
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]