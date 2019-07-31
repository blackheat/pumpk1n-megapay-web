FROM node:10-alpine AS builder
WORKDIR /app
COPY . .
RUN apk add --no-cache --virtual .gyp python make g++ \
    && npm install \
    && apk del .gyp
RUN npm run build

FROM nginx:alpine
EXPOSE 80
COPY --from=builder /app/dist/* /usr/share/nginx/html/