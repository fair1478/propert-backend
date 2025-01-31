# Build Stage
FROM node:22 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Run Stage (Production)
FROM node:22
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app ./
RUN npm prune --production
EXPOSE 5000
CMD ["node", "index.js"]
