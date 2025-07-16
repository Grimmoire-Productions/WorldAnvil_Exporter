# Local Development

This guide assumes familiarity with Git, Node.js, and command line tools. New to development? Start with our [beginner's guide](./newToDevelopment.md).

## Prerequisites

- Node.js v18+ and npm
- Git
- Make (recommended)
- World Anvil credentials (contact Kelsey)

## Security

World Anvil credentials have write access. Never commit them to version control or expose them in logs.

## Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/GrimmoireProductions/WorldAnvil_Exporter.git
   cd WorldAnvil_Exporter
   ```

2. Initialize development environment:

   ```bash
   make dev-setup
   ```

   This will:
   - Prompt you for your World Anvil API Token (press Enter for default)
   - Prompt you for the World Anvil Application API Key (press Enter for default)
   - Create `.env` file for the frontend
   - Create `server/.env` file for the backend
   - Install dependencies (npm install)

   The script handles all environment setup interactively, so you don't need to manually set environment variables.

3. Start development server:

   ```bash
   make start
   ```

   This will start:
   - Backend server at http://localhost:3001
   - Frontend at http://localhost:5173
   - Open http://localhost:5173 in a browser window

   Alternatively, you can run just the frontend or just the backend:

   ```bash
   make start  # Frontend only at http://localhost:5173
   ```

   ```bash
   make run server:dev  # Start backend server only
   ```

## Development Commands

```bash
# Development servers
make start          # Start both backend and frontend servers and open browser
npm run dev         # Start both backend and frontend servers
npm run start       # Start frontend server only
npm run server:dev  # Start backend server only

# Testing & linting
make test           # Run test suite
npm run test:watch  # Run tests in watch mode
npm run lint        # Run ESLint
npm run typecheck   # TypeScript type checking

# Building
make build          # Production build (frontend)
npm run build:server # Build server TypeScript
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

## Backend Development

The backend server provides secure API integration:

- **Server Entry**: `server/src/app.ts` - Express app with session management
- **API Routes**: `server/src/routes/` - Auth, worlds, and character endpoints
- **Services**: `server/src/services/` - World Anvil API integration
- **Environment**: Backend requires `WA_API_KEY` in `server/.env`

## Frontend Architecture

- **Context Providers**: UserContext, WorldContext, ArticleContext for state management
- **Containers**: App orchestration and main UI flows
- **Components**: Reusable UI elements and character sheet rendering
- **Utils**: API clients, BBCode processing, content formatting

## Additional Resources

- [World Anvil API Documentation](https://www.worldanvil.com/api/external/boromir/swagger-documentation)
- [CLAUDE.md](../CLAUDE.md) - AI assistant instructions and codebase overview
