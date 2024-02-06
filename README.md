# WorldAnvil_Exporter

## Rquirements

- An API token for the Grimmoire Producitons World Anvil account (will be different for each user)
- The World Anvil API Key

If you don't have WA credentials, talk to Kelsey.

### Treatment of Credentials

Correct handling of World Anvil credentials is crucial to the secruity of our systems, and in the hands of a band actor, could be catastrophic (like, deleting literally everything).

Do Not:

- Make copies of or save WA credentials on your computer beyond the env file created by following this README.
- Save WA credentials in any cloud service (personal password storage, Google Drive, etc.)
- Share World Anvil credentials with other members of staff
- Make World Anvil credentials public

## Setting up local dev environment

1. Source World Anvil credentials onto your shell.

    ```bash
    export WA_API_KEY={World Anvil API key here}
    export WA_GP_API_TOKEN={Grimmoire Productions WA API token here}
    ```

   Confirm you've loaded the variables correctly with:

    ```bash
    echo "WA_API_KEY=$WA_API_KEY, WA_GP_API_TOKEN=$WA_GP_API_TOKEN"
    ```

2. In the root of the project folder, run the following steps to setup the local environment:

    ```bash
    make dev-setup
    ```

    This will copy your API key and token into a new .env file that will stay only on your machine. This is to prevent our API keys from being made public on the github repo.

## Running the tool locally

1. In the root of the project folder, run the following command:

    ```bash
    make start
    ```

2. localhost:3000 should open in your chrome web browser. If you get errors when you click "submit" it may be because you didn't run `make dev-setup` first.
    Mr. John Radcliffe is a great character to test with. Article ID: `49170f44-a961-45ed-b860-bcf612b4d55d`