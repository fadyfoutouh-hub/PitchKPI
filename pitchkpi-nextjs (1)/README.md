# PitchKPI — Next.js Football Business Intelligence

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this code to a GitHub repo
2. Click the button above or go to [vercel.com](https://vercel.com)
3. Import your repo
4. Deploy instantly

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Option 3: GitHub Actions (Auto-deploy)
Add `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📁 Project Structure
```
pitchkpi-nextjs/
├── app/
│   ├── api/news/route.ts      # Server-side RSS fetcher (no CORS!)
│   ├── page.tsx               # Main page with live updates
│   ├── layout.tsx             # Root layout + SEO
│   ├── globals.css            # Global styles + CSS variables
│   └── page.module.css        # Component styles
├── lib/
│   └── data.ts                # Static data, types, helpers
├── public/                    # Static assets
├── package.json
├── next.config.js
└── tsconfig.json
```

## 🔥 What's Better Than the HTML Version?

| Feature | HTML | Next.js |
|---------|------|---------|
| **RSS Fetching** | Client-side (CORS issues) | Server-side (no CORS!) |
| **Auto-refresh** | 90s polling | ISR + client polling |
| **SEO** | Manual meta tags | Automatic + structured data |
| **Performance** | Full page reload | Partial hydration |
| **Dark mode** | Flickers on load | Instant, no flash |
| **Vercel deploy** | Manual upload | Git push = auto deploy |

## 🔄 Auto-Update System

- **API Route** (`/api/news`) fetches RSS + GNews server-side every 60s
- **Client** polls API every 90s, highlights new stories with gold border
- **ISR** rebuilds page every 5 minutes for SEO freshness

## 📝 Environment Variables (Optional)

| Variable | Description |
|----------|-------------|
| `GNEWS_API_KEY` | Your GNews API key (free tier: 100 req/day) |

## 🛠️ Local Development

```bash
cd pitchkpi-nextjs
npm install
npm run dev
# Open http://localhost:3000
```

## 📦 Built With
- Next.js 15 (App Router)
- React 19
- TypeScript
- CSS Modules
- xml2js (RSS parsing)
