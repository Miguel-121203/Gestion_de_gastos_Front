
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

# Expose port 4200
EXPOSE 4200

# Start the development server
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]