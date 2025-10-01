FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm install -g http-server

EXPOSE 4200

# Cambiar esta línea - servir desde /app/dist/gestion-gastos/browser
CMD ["http-server", "dist/gestion-gastos/browser", "-p", "4200", "-c-1"]