# ======================================
# Stage 1: Build Angular application
# ======================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy application source
COPY . .

# Build argument for environment
ARG ENV_NAME=production
ENV ENV_NAME=${ENV_NAME}

# Build Angular application for the specified environment
RUN echo "Building for environment: ${ENV_NAME}" && \
    if [ "$ENV_NAME" = "production" ]; then \
        npm run build:prod; \
    elif [ "$ENV_NAME" = "qa" ]; then \
        npm run build:qa; \
    elif [ "$ENV_NAME" = "dev" ]; then \
        npm run build:dev; \
    else \
        npm run build:prod; \
    fi

# ======================================
# Stage 2: Serve with Nginx
# ======================================
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/gestion-gastos/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
