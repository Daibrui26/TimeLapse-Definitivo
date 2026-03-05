# ===== STAGE 1: Build =====
FROM node:20-alpine AS build
WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar
COPY . .
RUN npm run build-only

# ===== STAGE 2: Serve con nginx =====
FROM nginx:alpine AS final

# Copiar la build de Vite al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]