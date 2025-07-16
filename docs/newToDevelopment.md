# New to Development? Start Here

This guide is for people who have never worked with command line tools or development environments before. If you're already familiar with Git, Node.js, and command line basics, see the [Local Development Guide](./localDev.md) instead.

## What You'll Need

- World Anvil credentials (contact Kelsey)
- About 30 minutes to set up your environment
- Basic computer skills (you'll learn the rest!)

## Important Security Warning

World Anvil credentials can modify or delete all our content. **Never**:

- Save credentials outside the `.env` files created by our setup
- Store credentials in cloud services or password managers
- Share credentials with other staff members
- Post credentials online

Credentials will be shared via 1Password links that will expire after 7 days, so it's recommended you only request them when you're ready to set up the application so can immediately input them into the application when instructed during setup.

## Getting Started

If you've never worked with command line tools before, here's what you need to do:

### Step 1: Open Your Command Line

First, you need to open a terminal (command line) application:

**Windows:**

- Press `Windows`+`X` and click "Windows PowerShell (Admin)"
- Or: Search for "PowerShell" in Start menu, right-click, and choose "Run as Administrator"

**macOS:**

- Go to Applications → Utilities → Terminal
- Or: Press `Cmd+Space`, type "Terminal", and press Enter

### Step 2: Install Required Software

You'll need to install several tools. Don't worry - we'll check what you already have first!

#### Check What's Already Installed

Copy and paste these commands one at a time into your terminal:

```bash
node --version
npm --version
git --version
make --version
```

If you see version numbers (like `v18.0.0`) for all four, skip to Step 3. Otherwise, continue below.

#### Install Missing Software

1. **Node.js and npm**: Follow [these instructions](https://nodejs.org/en/download/) to install Node.js (npm comes with it)

2. **Git**:

   - macOS: Usually pre-installed, but if missing, install from [git-scm.com](https://git-scm.com/download/mac)
   - Windows: Download and install from [git-scm.com](https://git-scm.com/download/win)

3. **Make** (Windows only):

   First, let's check if you have `winget` (Windows Package Manager):

   a. In your PowerShell window, type:

      ```powershell
      winget --version
      ```

   b. **If you see a version number** (like `v1.4.10173`):

      - Great! Skip to step (d) below.

   c. **If you get an error** saying `'winget' is not recognized...`:

      - Open the Microsoft Store (search for it in Start menu)
      - Search for "App Installer"
      - Click "Get" or "Install"
      - Close and reopen PowerShell as Administrator
      - Try `winget --version` again - it should now show a version number

   d. Install Make by typing:

      ```powershell
      winget install -e --id GnuWin32.Make
      ```

   e. **Important**: Close and reopen PowerShell to refresh your system

   f. Verify Make is installed by typing:

      ```powershell
      make -v
      ```

      You should see version information for GNU Make!

4. **Important**: Close and reopen your command line to refresh your system, following the same method as in [Step 1](#step-1-open-your-command-line)

5. Re-input all the version commands from the start of [Step 2](#step-2-install-required-software) to verify you have everything installed.

#### Recommended Tools

- **GitHub Desktop**: [Download here](https://desktop.github.com/) - Makes Git easier with a visual interface
- **VS Code**: [Download here](https://code.visualstudio.com/) - For viewing and editing code (optional)

### Step 3: Get the Project Code

1. **Using GitHub Desktop** (recommended for beginners):
   a. Clone the repository following [these instructions](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

2. **Navigate to the project folder**:
   a. In GitHub Desktop: Right-click "Current Repository" → "Copy Repo Path"
   b. In your terminal, type: `cd [paste-the-path-here]`

   Example:

   ```powershell
   cd C:\Users\YourName\WorldAnvil_Exporter
   ```

### Step 4: Set Up Your Environment

In your terminal (while in the project folder), run:

```bash
make dev-setup
```

When prompted:

- Enter your World Anvil API Token (or press Enter for a placeholder)
- Enter the World Anvil Application API Key (or press Enter for a placeholder)

This creates secure `.env` files that stay only on your computer.

### Step 5: Run the Application

1. **Start the servers**:

   ```bash
   npm run dev
   ```

2. **Open your browser**: The app will be at http://localhost:5173

## Keeping Your Code Updated

Before each work session:

1. **With GitHub Desktop**:
  a. Make sure "Current Branch" shows "main"
  b. Click "Fetch origin" then "Pull origin"

2. **With command line**:
  a. Navigate to the project folder per [Step 3.2](#step-3-get-the-project-code)

   ```bash
   git checkout main
   git pull
   ```

## Need More Details?

Once you're comfortable with these basics, check out the [Local Development Guide](./localDev.md) for:

- Additional development commands
- Project structure details
- Advanced configuration options
