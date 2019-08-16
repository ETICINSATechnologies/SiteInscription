prod-build:
	docker-compose -f docker-compose-prod.yml build

prod-up:
	docker-compose -f docker-compose-prod.yml up -d

prod-down:
	docker-compose -f docker-compose-prod.yml down -v

prod-logs:
	docker-compose -f docker-compose-prod.yml logs -f