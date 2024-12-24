up:
	docker compose up -d

ps:
	docker compose ps

stop:
	docker compose stop

rm: stop
	docker compose rm -f

logs:
	docker compose logs -f
