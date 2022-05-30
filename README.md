# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

## How to use this project

Before use will start developing, you should connect the following dependencies:

- MongoDB Realm App (https://www.mongodb.com/docs/atlas/app-services/manage-apps/deploy/automated/deploy-automatically-with-github/#std-label-deploy-github) the app configuration is placed inside this repository (/realm-app)
- Posthog Instance (https://posthog.com/docs/cloud)
- Vercel integration (https://vercel.com/docs/concepts/projects/overview)
- Vercel ENV variables

```bash
    VITE_POSTHOG_COOKIE_NAME="posthog_userId"
    VITE_POSTHOG_HOST="https://app.posthog.com"
    VITE_POSTHOG_EVENT_NAME="SHORTLINK_CLICKED"
    VITE_POSTHOG_TOKEN="" // (https://posthog.com/docs/api)
    VITE_APP_DOMAIN=""
    VITE_APP_HOST=""
    VITE_API_URL="https://realm.mongodb.com/api/client/v2.0"
    VITE_REALM_APP_NAME=""
    VITE_REALM_APP_ID=""
    VITE_REALM_API_KEY="" // this is the  server API key for the Realm App (https://www.mongodb.com/docs/atlas/app-services/authentication/api-key/)
    VITE_REFRESH_TOKEN_COOKIE_NAME="dev_refreshToken" // this is the name of the cookie that will be used to store the refresh token (e.g. for preview branches you can use "stage_refreshToken", for production "refreshToken")
    VITE_ACCESS_TOKEN_COOKIE_NAME="dev_accessToken" // this is the name of the cookie that will be used to store the refresh token (e.g. for preview branches you can use "stage_accessToken", for production "accessToken")
```

- Connect this app to Vercel via (npx vercel)
- Import environment variables for Vercel (npm run pre-dev)
