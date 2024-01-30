#!/usr/bin/env bash

# Create the .env file with API secrets from shell
SECRET_KEYS="\$WA_API_KEY:\$WA_GP_API_TOKEN"

envsubst $SECRET_KEYS < env.template > .env