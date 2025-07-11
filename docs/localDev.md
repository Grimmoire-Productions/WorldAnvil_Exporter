# Local Development

## Prerequisites

- Node.js (v18+) and npm
- Git
- Make (optional but recommended)
- World Anvil API credentials:
  - `WA_API_KEY` - The World Anvil API Key
  - `WA_GP_API_TOKEN` - Your personal API token for the Grimmoire Productions World Anvil account

Contact Kelsey for World Anvil credentials if needed.

## Security Notice

World Anvil credentials provide write access to all content. Mishandling could result in data loss.

**Never:**

- Commit credentials to version control
- Store credentials in cloud services
- Share credentials with other staff members
- Expose credentials in logs or error messages

## Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/GrimmoireProductions/WorldAnvil_Exporter.git
   cd WorldAnvil_Exporter
   ```

2. Set environment variables:

   **macOS/Linux:**

   ```bash
   export WA_API_KEY="your-api-key"
   export WA_GP_API_TOKEN="your-token"
   ```

   **Windows (PowerShell):**

   ```powershell
   $env:WA_API_KEY="your-api-key"
   $env:WA_GP_API_TOKEN="your-token"
   ```

3. Initialize development environment:

   ```bash
   make dev-setup  # Creates .env file and installs dependencies
   ```

   Or manually:

   ```bash
   cp .env.template .env
   # Edit .env with your credentials
   npm install
   ```

4. Start development server:

   ```bash
   make start  # or npm start
   ```

   The application will be available at http://localhost:3000

## Development Commands

```bash
make start          # Start dev server
make build          # Production build
make test           # Run test suite
make test-watch     # Run tests in watch mode
npm run lint        # Run ESLint
npm run typecheck   # TypeScript type checking
npm run preview     # Preview production build
```

## Testing

Test with these article IDs:

- General character: `49170f44-a961-45ed-b860-bcf612b4d55d` (Mr. John Radcliffe)
- Hawkins character: `b48e173f-7e04-46cd-a3f3-00c461965431`

## Project Structure

- `/src/containers/` - Main application containers
- `/src/components/` - Reusable UI components  
- `/src/context/` - React Context providers
- `/src/utils/` - API utilities and helpers
- `/src/assets/` - Theme-specific assets
- `/tests/` - Test files

## Additional Resources

- [World Anvil API Documentation](https://www.worldanvil.com/api/external/boromir/swagger-documentation)
- [New Developer Guide](./newToDevelopment.md) - For those new to command line tools
