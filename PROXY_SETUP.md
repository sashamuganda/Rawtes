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
