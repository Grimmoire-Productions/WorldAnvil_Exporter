dev-setup: ## Creates .env file and loads API keys
	@ ./scripts/dev-setup.sh
	@ npm i

start: ## Start both backend and frontend servers
	@ npm run dev

start-with-browser: ## Start servers and open browser in Chrome
	@ (sleep 3 && open -a "Google Chrome" http://localhost:5173) & npm run dev

build:
	@npm run build

test:
	@npm run test 

eject:
	npm run eject

check-auth:
	@ npm run check:auth

# Check if correct Node version is active
check-node:
	@REQUIRED_VERSION=$$(cat .nvmrc | tr -d '[:space:]'); \
	CURRENT_VERSION=$$(node --version | tr -d 'v'); \
	if [ "$$CURRENT_VERSION" != "$$REQUIRED_VERSION" ]; then \
		echo "❌ Wrong Node version detected!"; \
		echo "   Current: v$$CURRENT_VERSION"; \
		echo "   Required: v$$REQUIRED_VERSION (from .nvmrc)"; \
		echo ""; \
		echo "Fix this by running 'nvm use' in your shell:"; \
		echo "   nvm use"; \
		echo ""; \
		echo "If the version is not installed, run:"; \
		echo "   nvm install"; \
		exit 1; \
	else \
		echo "✅ Node version v$$CURRENT_VERSION is correct"; \
	fi

# Auto-fix linting issues and format code
it-pretty: check-node
	@echo "Auto-fixing linting issues..."
	npm run lint:fix
	@echo "Formatting code with Prettier..."
	npm run format
	@echo "✨ Code is now pretty!"
