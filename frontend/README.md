# InkHive frontend

This is a nextjs based site

- next auth for authentication
- Create file `.env.local` in the frontend directory with this content

```sh
ENV=dev
API_URL=http://localhost:8000
AUTH_URL=http://localhost:3000/api/auth
AUTH_SECRET=jeWa0U8EeXcptXCEZDZlG0em5MjEPOhycZlPpkk5BY72sPgD8M88lJ6MnrRWEw5w # openssl rand -hex 48
```

Installing dependencies

In the `frontend` directory, run

```sh
npm i
```

Starting the dev server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

For authentication, next auth is used

- [Checkout next auth documentation](https://authjs.dev/getting-started)
- [We use the credentials provider](https://authjs.dev/getting-started/authentication/credentials)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
