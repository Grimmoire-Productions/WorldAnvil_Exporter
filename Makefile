dev-setup: ## Creates .env file and loads API keys
	@ ./scripts/dev-setup.sh
	@ npm i

start:
	@ npm run start

build:
	@npm run build

test:
	@npm run test 

eject:
	npm run eject