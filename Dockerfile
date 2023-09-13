# Use a smaller base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies and clean up
RUN npm install --production && \
    npm cache clean --force

# Copy the client source code to the working directory
COPY . .

# Expose port 3002 (change to what you need)
EXPOSE 3002

# Run the client
CMD ["node", "index.js"]
