# Development Stage
FROM node:22-alpine as  dev

# Define working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package.json ./
RUN npm install

# Copy source code
COPY client/ .

EXPOSE 3000

# Start in container
CMD ["npm", "start"]