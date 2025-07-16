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

# Export variables for envsubst
export WA_GP_API_TOKEN
export WA_API_KEY

# Create the .env file in project root
SECRET_KEYS="\$WA_API_KEY:\$WA_GP_API_TOKEN"
envsubst $SECRET_KEYS < env.template > .env

# Create the server/.env file
envsubst $SECRET_KEYS < server/env.template > server/.env

echo "Environment files created successfully!"
echo "- .env (frontend)"
echo "- server/.env (backend)"