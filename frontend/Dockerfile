# frontend/Dockerfile
FROM node:18 as build

WORKDIR /app

# Install dependencies and build React app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use a lightweight server to serve the React app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the frontend port
EXPOSE 3000
