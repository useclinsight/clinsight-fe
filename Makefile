.PHONY: test build dev lint typecheck

test:
	pnpm typecheck

build:
	pnpm build

dev:
	pnpm dev

lint:
	pnpm lint

typecheck:
	pnpm typecheck
