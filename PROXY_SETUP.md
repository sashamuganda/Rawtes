# Setting up the Cloudflare Worker Proxy

Since GitHub's OAuth endpoints do not support CORS, a proxy is required for the browser to communicate with them directly. This project includes a Cloudflare Worker script to handle this securely.

## Deployment Steps

1.  **Install Wrangler**:
    ```bash
    npm install -g wrangler
    ```

2.  **Login to Cloudflare**:
    ```bash
    wrangler login
    ```

3.  **Deploy the Worker**:
    Navigate to the `proxy-worker` directory and deploy:
    ```bash
    cd proxy-worker
    wrangler deploy
    ```

4.  **Configure the Worker (Optional)**:
    By default, the worker allows all origins (`*`). To restrict it to your domain:
    - Open `proxy-worker/wrangler.toml`
    - Change `ALLOWED_ORIGIN` to your domain (e.g., `https://sashamuganda.github.io`)
    - Redeploy with `wrangler deploy`

5.  **Update your Rawtes Environment**:
    - Get the URL of your deployed worker (e.g., `https://rawtes-proxy.your-name.workers.dev`)
    - Add it to your `.env` file or GitHub Actions secrets as `VITE_PROXY_URL`.

## Option 2: Vercel

If you host Rawtes on Vercel, the proxy is handled automatically by a serverless function in `/api/proxy.ts`.

1.  **Connect to Vercel**: Connect your GitHub repository to a new Vercel project.
2.  **Configure**: Vercel will automatically detect the `vercel.json` and build settings.
3.  **Environment Variables**: Add `VITE_GITHUB_CLIENT_ID` in the Vercel dashboard.

## Option 3: Netlify

If you host Rawtes on Netlify, the proxy is handled automatically by a serverless function in `/netlify/functions/proxy.ts`.

1.  **Connect to Netlify**: Connect your GitHub repository to a new Netlify site.
2.  **Configure**: Netlify will detect the `netlify.toml`.
3.  **Environment Variables**: Add `VITE_GITHUB_CLIENT_ID` in the Netlify dashboard.
