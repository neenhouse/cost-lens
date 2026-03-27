export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  UPLOADS: R2Bucket;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API routes
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, url, env);
    }

    // Serve static assets (SPA)
    return env.ASSETS.fetch(request);
  },

  async scheduled(_event: ScheduledEvent, _env: Env, _ctx: ExecutionContext): Promise<void> {
    // TODO: Daily forecast refresh and budget alert checks
    console.log("Scheduled task executed");
  },
};

async function handleApi(request: Request, url: URL, _env: Env): Promise<Response> {
  // Health check
  if (url.pathname === "/api/health") {
    return Response.json({ status: "ok", timestamp: new Date().toISOString() });
  }

  return Response.json({ error: "Not found" }, { status: 404 });
}
