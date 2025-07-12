dev-setup: ## Creates .env file and loads API keys
	@ ./scripts/dev-setup.sh
	@ npm i

start:
	@ npm run start

start-dev-mode: ## Start in dev mode with mock user (bypasses login)
	@ VITE_DEV_MODE=true npm run start

build:
	@npm run build

test:
	@npm run test 

eject:
	npm run eject