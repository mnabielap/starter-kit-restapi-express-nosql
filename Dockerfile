# Use Node.js 22
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files first to utilize Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code to JavaScript (dist folder)
RUN npm run build

# Create an uploads directory (for the media volume)
RUN mkdir -p uploads

# Copy entrypoint script and make it executable
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Expose the port defined in .env.docker
EXPOSE 5005

# Start the application
ENTRYPOINT ["./entrypoint.sh"]