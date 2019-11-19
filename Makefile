build:	check
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down -v

logs:
	docker-compose logs -f

exec:
	docker-compose exec app sh

check:
	./provisioning/check_environment.sh

prod: down build up
