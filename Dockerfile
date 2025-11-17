# ======================================
# Stage 1: Build Angular application
# ======================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

ARG ENV_NAME=production
ENV ENV_NAME=${ENV_NAME}

RUN echo "Building for environment: ${ENV_NAME}" && \
    if [ "$ENV_NAME" = "production" ]; then \
    npm run build:prod; \
    elif [ "$ENV_NAME" = "qa" ]; then \
    npm run build:qa; \
    elif [ "$ENV_NAME" = "development" ]; then \
    npm run build:dev; \
    else \
    npm run build:prod; \
    fi

# ======================================
# Stage 2: Serve with Nginx
# ======================================
FROM nginx:alpine

ARG ENV_NAME=production

COPY nginx-dev.conf /tmp/nginx-dev.conf
COPY nginx-qa.conf /tmp/nginx-qa.conf
COPY nginx-prod.conf /tmp/nginx-prod.conf

RUN if [ "$ENV_NAME" = "development" ]; then \
    echo "Using development nginx config" && \
    cp /tmp/nginx-dev.conf /etc/nginx/conf.d/default.conf; \
    elif [ "$ENV_NAME" = "qa" ]; then \
    echo "Using qa nginx config" && \
    cp /tmp/nginx-qa.conf /etc/nginx/conf.d/default.conf; \
    elif [ "$ENV_NAME" = "production" ]; then \
    echo "Using production nginx config" && \
    cp /tmp/nginx-prod.conf /etc/nginx/conf.d/default.conf; \
    else \
    echo "Using default production nginx config" && \
    cp /tmp/nginx-prod.conf /etc/nginx/conf.d/default.conf; \
    fi && \
    rm /tmp/nginx-*.conf

COPY --from=builder /app/dist/gestion-gastos/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]