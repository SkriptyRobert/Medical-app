# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Next stage
FROM nginx:alpine

# Kopy build do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Kopy nginx konfigurace
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 