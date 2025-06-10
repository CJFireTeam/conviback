# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json yarn.lock ./

# Instala las dependencias
RUN yarn install

# Copia todo el proyecto
COPY . .

# Construye la app (si usas el build para producción)
RUN yarn build

# Expone el puerto por defecto de Strapi
ENV PORT=80
EXPOSE 80
CMD ["yarn", "start"]

# Inicia Strapi