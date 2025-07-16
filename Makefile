dev-setup: ## Creates .env file and loads API keys
	@ ./scripts/dev-setup.sh
	@ npm i

start: ## Start both backend and frontend servers and open browser
	@ (sleep 3 && (open -a "Google Chrome" http://localhost:5173 2>/dev/null || open http://localhost:5173)) & npm run dev

build:
	@npm run build

test:
	@npm run test 

eject:
	npm run eject