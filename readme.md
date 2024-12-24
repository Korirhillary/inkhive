# Inkhive

This is a simple blogging app that has these features

- posts list
- posts categories
- registered / logged in users can add posts, create categories
- You can check users posts
- logged in users can update/delete their own posts and categories

## Tools and technologies used

- Backend - Python (fastapi)
- Frontend - Typescript (NextJS)
- Database - postgres

## Backend

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
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic pydantic bcrypt python-jose

pip install 'pydantic[email]'
pip install passlib
pip install python-multipart

```

Running the app

```sh
uvicorn main:app --reload
```
