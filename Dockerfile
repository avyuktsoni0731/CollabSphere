# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Stage 2 - Run
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm", "start"]
