# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Instalace závislostí
COPY package*.json ./
RUN npm install

# Instalace Vite globálně
RUN npm install -g vite

# Kopírování zdrojových souborů
COPY . .

# Build aplikace
RUN npm run build

# Production stage
FROM nginx:alpine

# Kopírování build výstupu do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Kopírování nginx konfigurace
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
