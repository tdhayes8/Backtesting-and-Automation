# Use a Node.js base image
FROM node:16-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . /app/

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]