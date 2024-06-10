
#Stage 1
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN apk add --no-cache yarn
RUN yarn install
COPY . .
RUN yarn build

#Stage 2
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .

EXPOSE 3000
ENTRYPOINT ["nginx", "-g", "daemon off;"]