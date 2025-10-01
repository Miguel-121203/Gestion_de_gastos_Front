FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install http-server globally
RUN npm install -g http-server

# Expose port 4200
EXPOSE 4200

# Serve the built application
CMD ["http-server", "dist/gestion-gastos", "-p", "4200", "-c-1", "--proxy", "http://localhost:4200?"]