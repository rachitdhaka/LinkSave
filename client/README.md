This is the LinkSave frontend built with Next.js.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Run the API server separately from the `server/` folder. By default the Next app proxies `/api/*` requests to `http://localhost:5000` in development.

To override the backend origin, set either `API_URL` or `NEXT_PUBLIC_API_URL` in `client/.env.local`:

```bash
API_URL=https://your-backend.example.com
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

In production, if no override is supplied, the app falls back to the deployed Render API used by this project.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
