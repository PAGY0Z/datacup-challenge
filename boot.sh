#!/bin/bash

# Ensure the script is executed from the project root
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR"

echo "Starting the application setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Pull the latest Docker images (if necessary)
echo "Pulling the latest Docker images..."
docker-compose pull

# Build the Docker containers
echo "Building Docker containers..."
docker-compose build

# Start the Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Check the status of the containers
echo "Checking container status..."
docker-compose ps

# Optional SSL setup
read -p "Do you want to configure SSL with Let's Encrypt? (y/n): " ssl_choice
if [[ "$ssl_choice" =~ ^[Yy]$ ]]; then
    echo "Stopping Nginx container..."
    docker stop nginx

    read -p "Enter your domain name (e.g., aro-chatbot.re): " domain
    read -p "Enter your www domain name (e.g., www.aro-chatbot.re): " www_domain

    echo "Requesting SSL certificates from Let's Encrypt..."
    certbot certonly --standalone -d "$domain" -d "$www_domain"

    if [ $? -eq 0 ]; then
        echo "SSL certificates successfully obtained."

        echo "Starting Nginx container..."
        docker start nginx

        echo "SSL setup complete! Your application is now available at https://$domain"
    else
        echo "Failed to obtain SSL certificates. Please check the error messages and try again."
    fi
else
    echo "Skipping SSL setup."
fi

echo "Application setup is complete. Access your app at http://aro-chatbot.re"
