FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
