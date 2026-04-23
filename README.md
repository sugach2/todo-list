# todo-list

Vercel Runtime を前提にした ToDo アプリです。  
フロントエンドは `public/`、API は `api/todos.js` で動きます。

## Prerequisites

- Node.js 20+

## Environment Variables

`.env.local` に以下を設定してください。

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

## Run (Local)

```bash
npm run dev
```

`npm run dev` は `.env.local` を読み込んだうえで `npx vercel dev --local` を起動し、`public/` と `api/` を同じランタイムで実行します。

## Deploy

```bash
vercel
```

Vercel プロジェクト側にも `SUPABASE_URL` と `SUPABASE_SECRET_KEY` を設定してください。
