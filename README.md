# balboa

This is the primary repository for [Grueplan](https://grueplan.com).

## Local Development

First, create a postgres database within a disposable container.

```bash
podman run --name postgresql-container -p 5432:5432 -e POSTGRES_PASSWORD=dev123 -d postgres
```

Then, run the local development server:

```bash
pnpm run local
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployments on Vercel

- [Production](https://grueplan.com)
- [Development](https://dev.grueplan.com)
- [Storybook](https://balboa-storybook.vercel.app)

## Learn More

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
