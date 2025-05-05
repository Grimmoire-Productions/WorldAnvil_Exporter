# WorldAnvil_Exporter

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Rquirements

- Know how to open Terminal or Powershell on your computer
- Git
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

## New to local development?

If you've never worked with command line tools before, here's what you need to get started:

### Install pre-requisites

1. Open a command prompt application

    **Windows:** Press `Windows`+`X` to open the Power User Menu then click "Windows PowerShell(Admin)". It's usually located between "Computer Management" and "Task Manager." Alternatively, you can open the start menu, search for "PowerShell", then right-click the result and click "Run as Administrator"

    **MacOS:** Go to "Applications" > "Utilities" and click on "Terminal"

2. Install nvm, node.js, and npm

    Check if you already have these installed using the following commands in your command prompt application:

    ```bash
    nvm --version
    ```

    ```bash
    node --version
    ```

    ```bash
    npm --version
    ```

    If you get a response that looks like a version number for all 3 of these, skip to the next step. If you've only got node and npm installed but not nvm, don't worry about nvm and skip to the next step as well.

    Otherwise, follow [these instructions](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) to install all three (Windows users, make sure not to skip the stuff under "Wrapping up" below the Mac instructions)

3. Install git
    Check if you already have git installed using the following in your command prompt application (Macs _should_ come with Git pre-installed, but you should follow these steps to double check anyway.)

    ```bash
    git version
    ```

    If you get a response that looks like a version number for all 3 of these, skip to the next step.

    Otherwise, install git following [these instructions](https://github.com/git-guides/install-git)

4. **Windows only:** use [these instructions](https://earthly.dev/blog/makefiles-on-windows/) to install Chocolatey and `make`. (It's the first subheader. Ignore the other options it gives after)

5. Install VSCode using [here](https://code.visualstudio.com/download) (Optional if you don't plan to ever look at the code, but can be good for viewing hidden files)

6. Install GitHub desktop following [these instructions](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/setting-up-github-desktop)
    You could do everything GitHub desktop does with command line prompts, but this gives you a user interface that might be less intimidating.

7. Install gettext
    - For MacOS, install [homebrew](https://brew.sh/) via it's instructions. Then, in your terminal, run `brew install gettext`
    - For Windows:
        - Download the [precompiled binary installer](https://mlocati.github.io/articles/gettext-iconv-windows.html). Download the "static" flavor of your Operating System (32bit or 64bit) and simple run the installer.
        - Update the system PATH: `Control Panel > System > Advanced > Environment Variables`
        - In the System variables list, click Path, click Edit and then New. Add `C:\Program Files\gettext-iconv\bin` value.

## Setting up local dev environment

1. Clone the `WorldAnvil_Exporter` repository using [these instructions](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

2. Source World Anvil credentials onto your shell.

    Mac OS

    ```bash
    export WA_API_KEY={World Anvil API key here}
    export WA_GP_API_TOKEN={Grimmoire Productions WA API token here}
    ```

    Windows

    ```bash
    set WA_API_KEY={World Anvil API key here}
    set WA_GP_API_TOKEN={Grimmoire Productions WA API token here}
    ```

   Confirm you've loaded the variables correctly with:

    Mac OS

    ```bash
    echo "WA_API_KEY=$WA_API_KEY, WA_GP_API_TOKEN=$WA_GP_API_TOKEN"
    ```

    Windows

    ```bash
    set WA_API_KEY
    set WA_GP_API_TOKEN
    ```

3. In the root of the project folder, run the following steps to setup the local environment:

    ```bash
    make dev-setup
    ```

    This will copy your API key and token into a new .env file that will stay only on your machine. This is to prevent our API keys from being made public on the github repo.

## Running the tool locally

1. In your command line tool, navigate to the project folder

    Find the full filepath for the WorldAnvil_Exporter directory (in GitHub desktop, right click where it says "Current Repository" and then click "copy repo path")

    Then, in your command prompt application, type `cd` followed by a space and then the filepath. Hit eneter. (`cd` stands for "**C**hange **D**irectory")

    Example:

    ```bash
    cd C:\Users\Your_Name\WorldAnvil_Exporter
    ```

    You should then see something like this:

    ```bash
    C:\> cd C:\Users\Your_Name\WorldAnvil_Exporter
    C:\Users\Your_Name\WorldAnvil_Exporter (main)>
    ```

2. Make sure you have the latest version of the project

    GitHub desktop:
        - Make sure "Current Branch" is "main" in the header bar
        - Get any project updates following [these instructions](https://docs.github.com/en/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/syncing-your-branch-in-github-desktop#pulling-to-your-local-branch-from-the-remote) (Don't worry about anything other than the "Pulling to your local branch from the remote" subheader)

    Command Prompt:
        - if you don't see "main" after the filepath, switch to the main branch  `git checkout main`
        - then, get the latest updates from GitHub by entering `git pull`

    Example of how that looks:

    ```bash
    ➜  WorldAnvil_Exporter git:(handle-null-footnotes) git checkout main
    Switched to branch 'main'
    Your branch is up to date with 'origin/main'.
    ➜  WorldAnvil_Exporter git:(main) git pull
    Already up to date.
    ➜  WorldAnvil_Exporter git:(main)
    ```

3. In the root of the project folder, run the following command:

    ```bash
    make start
    ```

4. localhost:3000 should open in your chrome web browser. If you get errors when you click "submit" it may be because you didn't run `make dev-setup` first.
    Mr. John Radcliffe is a great character to test with. Article ID: `49170f44-a961-45ed-b860-bcf612b4d55d`