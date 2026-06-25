const TIMEOUT_MS = 10000;

module.exports = async function handler(req, res) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({
      ok: false,
      service: 'supabase',
      status: 'unreachable',
      httpStatus: 405,
      latency: 0,
      timestamp,
      error: `Method ${req.method} not allowed`
    });
    console.warn(`[api/ping] Rejected ${req.method} — method not allowed`);
    return;
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    res.status(500).json({
      ok: false,
      service: 'supabase',
      status: 'unreachable',
      httpStatus: 500,
      latency: 0,
      timestamp,
      error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables'
    });
    console.error(`[api/ping] Missing SUPABASE_URL or SUPABASE_ANON_KEY`);
    return;
  }

  const match = SUPABASE_URL.match(/https?:\/\/(.+)\.supabase\.co/);
  const project = match ? match[1] : null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  console.log(`[api/ping] Starting — GET /auth/v1/health`);

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const latency = Date.now() - start;

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');

    if (response.ok) {
      const body = {
        ok: true,
        service: 'supabase',
        status: 'reachable',
        httpStatus: response.status,
        latency,
        timestamp,
        project
      };
      console.log(`[api/ping] Completed — ${response.status} in ${latency}ms`);
      res.status(200).json(body);
    } else {
      const body = {
        ok: false,
        service: 'supabase',
        status: 'unreachable',
        httpStatus: 503,
        latency,
        timestamp,
        project,
        error: `Supabase returned HTTP ${response.status}`
      };
      console.warn(`[api/ping] Failed — HTTP ${response.status} in ${latency}ms`);
      res.status(503).json(body);
    }
  } catch (error) {
    clearTimeout(timeoutId);

    const latency = Date.now() - start;

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');

    if (error.name === 'AbortError') {
      const body = {
        ok: false,
        service: 'supabase',
        status: 'timeout',
        httpStatus: 503,
        latency,
        timestamp,
        project,
        error: `Request timed out after ${TIMEOUT_MS}ms`
      };
      console.warn(`[api/ping] Timeout — ${TIMEOUT_MS}ms exceeded`);
      res.status(503).json(body);
    } else {
      const body = {
        ok: false,
        service: 'supabase',
        status: 'unreachable',
        httpStatus: 503,
        latency,
        timestamp,
        project,
        error: error.message
      };
      console.error(`[api/ping] Error — ${error.message} in ${latency}ms`);
      res.status(503).json(body);
    }
  }
};
