#!/usr/bin/env bash

# Prompt for WA_GP_API_TOKEN
echo -n "Enter your World Anvil API Token (press Enter for default): "
read WA_GP_API_TOKEN
if [ -z "$WA_GP_API_TOKEN" ]; then
    WA_GP_API_TOKEN="your-wa-api-token-here"
fi

# Prompt for WA_API_KEY
echo -n "Enter your World Anvil Application API Key (press Enter for default): "
read WA_API_KEY
if [ -z "$WA_API_KEY" ]; then
    WA_API_KEY="your-wa-app-api-key-here"
fi

# Create the .env file from env.template
sed "s/\$WA_GP_API_TOKEN/$WA_GP_API_TOKEN/g" env.template > .env

# Create the server/.env file from server/env.template
sed "s/\$WA_API_KEY/$WA_API_KEY/g" server/env.template > server/.env

echo "Environment files created successfully!"
echo "- .env (frontend)"
echo "- server/.env (backend)"