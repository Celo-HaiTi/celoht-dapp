# CeloHT full-stack deployment plan

## Ki sa nou deja genyen

- Repo frontend: `celoht-dapp` (sa a deja fèt epi GitHub Pages a travay ak build siksè)
- Repo backend: `/workspaces/celoht-backend`
- Repo indexer: `/workspaces/celoht-indexer`
- Repo Supabase: `/workspaces/celoht-supabase`

## Kote sa yo pral deplwaye

1. Supabase project
2. Indexer service
3. Backend service
4. Frontend GitHub Pages

## Etap 1 — Supabase

### Sa pou fè

1. Kreye yon nouvo Supabase project.
2. Konekte `supabase` CLI a pwojè a.
3. Mete migrasyon yo: `supabase db push` nan repo `celoht-supabase`.
4. Verifye migration yo, RLS yo, storage buckets yo, ak policies yo.

### Komen pou l sèvi

```bash
cd /workspaces/celoht-supabase
npm ci
supabase link --project-ref "$SUPABASE_PROJECT_REF"
supabase db push
```

### Environment ki nesesè

File `.env.example` nan `celoht-supabase` bay sa sa yo:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CELO_RPC_URL`
- `CELO_CONFIRMATION_DEPTH`
- `WORKER_IDENTITY`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `CELO_CHAIN_ID=11142220`

### Siksè kriter

- tables yo kreye
- RLS aktif
- storage buckets yo an place
- anon key yo travay pou frontend
- service role key yo sèlman pou backend/indexer

---

## Etap 2 — Indexer

### Repo a

- `/workspaces/celoht-indexer`

### Sa pou fè

1. Deploy indexer la sou yon long-lived Node service.
2. Mete env vars yo (gade `.env.example`).
3. Fè `npm ci && npm run build`.
4. Kòmanse `npm start`.
5. Verifye health endpoints `GET /health` ak `GET /readyz`.

### Env vars ki nesesè

Na `celoht-indexer/.env.example`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CELO_NETWORK=celoSepolia`
- `CELO_RPC_URL`
- `CONFIRMATIONS=5`
- `BACKFILL_BATCH_SIZE=2000`
- `POLL_INTERVAL_MS=15000`
- `RPC_MAX_RETRIES=5`
- `RPC_TIMEOUT_MS=15000`
- `START_BLOCK=`
- `USDM_START_BLOCK=0`
- `DRY_RUN=false`

### Render deployment

Repo `celoht-indexer` gen deja `render.yaml`:

```yaml
services:
  - type: web
    name: celoht-indexer
    runtime: node
    plan: starter
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /readyz
```

### Verifye

- indexer la rive sou `/readyz`
- premye backfill fini
- evènman yo antre nan Supabase
- checkpoints yo travay

---

## Etap 3 — Backend

### Repo a

- `/workspaces/celoht-backend`

### Sa pou fè

1. Deploy backend la sou yon runtime ekstèn (Render, Railway, Fly, Cloud Run, VPS).
2. Mete env vars yo (gade `.env.example`).
3. Fè `npm ci && npm run build`.
4. Kòmanse `npm start`.
5. Verifye health endpoint la: `GET /api/v1/health`.

### Env vars ki nesesè

Na `celoht-backend/.env.example`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CELO_CHAIN_ID=11142220`
- `CELO_RPC_URL`
- `AUTH_SESSION_SECRET`
- `AUTH_NONCE_TTL_SECONDS=300`
- `AUTH_SESSION_TTL_SECONDS=86400`
- `CELOHT_ALLOWED_ORIGIN`
- `NODE_ENV=development`

### Render deployment

Repo `celoht-backend` gen deja `render.yaml`:

```yaml
services:
  - type: web
    name: celoht-backend
    runtime: node
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /api/v1/health
```

### Verifye

- `/api/v1/health` retounen 200
- `/api/v1/auth/nonce` travay
- `/api/v1/auth/verify` travay
- profile/notifications APIs travay

---

## Etap 4 — Finalize frontend konfigirasyon

### Repo a

- `/workspaces/celoht-dapp`

### Env vars pou frontend la

Nan `.env.example` repo `celoht-dapp`, env yo deja prezan:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Kisa pou fè

1. Mete yon backend URL aktyèl nan `NEXT_PUBLIC_BACKEND_URL`.
2. Mete yon `NEXT_PUBLIC_API_BASE_URL` si backend la gen API v1.
3. Mete `NEXT_PUBLIC_SUPABASE_URL` ak `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Re-run `npm run build:github-pages`.
5. Verifye GitHub Pages deployment la.

### Eksanple config

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.example.com
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.example.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Verifye

- dApp la pa afiche `Backend unavailable`
- notifications la travay
- wallet auth la travay
- data yo rantre nan app la

---

## Etap 5 — GitHub Pages / prod final

### Sa pou fè

1. Pwojè frontend la deja gen GitHub Actions.
2. Pouse commit final ak push sou `main`.
3. Verifye workflow `Deploy GitHub Pages` a.
4. Verifye live site a sou:
   - `https://celo-haiti.github.io/celoht-dapp/`
5. Verifye home page a afiche bon kontni.

### Final polish pou pwofesyonèl

- README klè
- architecture docs klè
- deployment docs klè
- badges/CI status
- changelog
- status page / health page

---

## Checklist final

### Supabase
- [ ] project kreye
- [ ] migrations aplike
- [ ] RLS aktif
- [ ] storage buckets travay
- [ ] anon/service role separe kòrèkteman

### Indexer
- [ ] deploye sou runtime long-lived
- [ ] env vars ranpli
- [ ] `npm run build` siksè
- [ ] `/readyz` 200
- [ ] done ap antre nan Supabase

### Backend
- [ ] deploye sou runtime ekstèn
- [ ] env vars ranpli
- [ ] `npm run build` siksè
- [ ] `/api/v1/health` 200
- [ ] auth APIs travay

### Frontend
- [ ] `NEXT_PUBLIC_*` env ranpli
- [ ] `npm run build:github-pages` siksè
- [ ] GitHub Pages workflow fini
- [ ] app la afiche kòrèkteman

---

## Remak enpòtan

Mwen pa ka fè deploy aktyèl yo sou Render / Supabase / GitHub Pages soti isit paske sa mande aksè ak sekre ekstèn (hosting creds, secrets, repo permissions, ak domain). Men mwen te prepare tout sa ki nesesè yo nan repo yo epi mwen te klonke yo lokalman pou w konnen egzakteman sa ki bezwen fè.

Sa ki rete sèlman se: ranpli env vars yo, mete repo yo sou hosting platfòm yo, epi pouse deploy yo.
