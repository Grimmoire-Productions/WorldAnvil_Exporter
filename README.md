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

## Running the tool

1. Before you run the tool, you want to make the World Anvil API key and API token stored in the .env file available. To do this, open your shell and run the following commands:

    ```bash
    cd {your filepath here}/WorldAnvil_Exporter
    source .env
    ```

    Confirm you've loaded the variables correctly with the following command, the output of which should match what's in your .env file.

    ```bash
    echo "WA_API_KEY=$WA_API_KEY, WA_GP_API_TOKEN=$WA_GP_API_TOKEN"
    ```
