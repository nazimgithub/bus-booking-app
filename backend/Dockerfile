# Devlopment stage
FROM node:22-alpine as  dev

# Define working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ .

EXPOSE 5000

CMD ["npm", "nodemon", "server.js"]