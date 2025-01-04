# InkHive Backend

Create a virtualenv

```sh
python -m venv ~/tmp/venvs/inkhive
```

Activate the virtualenv

```sh
source ~/tmp/venvs/inkhive/bin/activate
```

Installing fastapi and setting up dependencies

```sh
pip install -r requirements.txt
```

## Running the app

In the `backend` directory, run this command

```sh
uvicorn main:app --reload
```

## Testing backend API

- We use [VSCode rest client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to test the api
- The request definition is in the file [client.http](./client.http)

## Postgres Database Set Up

- Postgres is used for the database
- If you have a running postgres, you can pass the details to the connection string
- There is a [docker compose](../compose.yml) definition that can be used to easily bring up postgres
- You need docker installed to continue
- You can start postgres with this command in the [root](../) directory

```sh
docker compose up -d
```

To check for running processes and confirm that postgres is up, use this command

```sh
docker compose ps
```

- There is a [Makefile](../Makefile) that makes the process easier
- To start postgres

```sh
make up
```

To check processes

```sh
make ps
```

## Database access

- This is the postgres connection string `postgresql://inkhive:inkhive@localhost:5432/inkhive`, you can use with any client
- If you have the postgresql client set up locally and accessible from your terminal (`psql` command), you can use this command

```sh
psql 'postgresql://inkhive:inkhive@localhost:5432/inkhive'
```

- You can also checkout [sqlectron](https://sqlectron.github.io/), a simple cross platform client to access
