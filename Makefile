prod-build:	check
	docker-compose -f docker-compose-prod.yml build

prod-up:
	docker-compose -f docker-compose-prod.yml up -d

prod-down:
	docker-compose -f docker-compose-prod.yml down -v

prod-logs:
	docker-compose -f docker-compose-prod.yml logs -f

check:
	./provisioning/check_environment.sh
	
compile-typescript:
	./provisioning/compile_typescript.sh

prod: prod-down prod-build prod-up
