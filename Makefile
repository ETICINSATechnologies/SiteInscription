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

check-dev:
	./provisioning/check_dev_environment.sh

dev: check-dev
	cd ./client && npm install
	cd ./client && npm start

dev-start:
	cd ./client && npm start

prod: down build up
