FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache bash \
 && npm install \
 && chmod -R 755 node_modules/.bin

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]