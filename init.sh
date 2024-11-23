#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting VPS initialization..."

# Ensure the script is executed with superuser privileges
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or use sudo"
    exit 1
fi

# Update and upgrade the system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "Installing required packages..."
apt install -y curl software-properties-common apt-transport-https ca-certificates gnupg lsb-release ufw

# Install Docker
echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io
else
    echo "Docker is already installed."
fi

# Install Docker Compose
echo "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose is already installed."
fi

# Enable Docker service
echo "Enabling Docker service..."
systemctl start docker
systemctl enable docker

# Set up UFW (Uncomplicated Firewall)
echo "Setting up UFW..."
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable

# Install Certbot
echo "Installing Certbot for SSL..."
# apt install -y certbot python3-certbot-nginx

# Print completion message
echo "VPS initialization is complete!"
echo "Next steps:"
echo "1. Place your project files on the VPS."
echo "2. Use ./boot.sh to start the application."
echo "3. Use Certbot to configure SSL (run: certbot certonly --standalone -d aro-chatbot.re)."
