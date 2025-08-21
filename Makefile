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