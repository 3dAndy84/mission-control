function authEnabled() {
  return Boolean(process.env.DASHBOARD_BASIC_AUTH_USER && process.env.DASHBOARD_BASIC_AUTH_PASS);
}

function isAuthorized(request) {
  if (!authEnabled()) return true;

  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;

  try {
    const decoded = atob(header.slice(6));
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) return false;

    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    return (
      user === process.env.DASHBOARD_BASIC_AUTH_USER &&
      pass === process.env.DASHBOARD_BASIC_AUTH_PASS
    );
  } catch {
    return false;
  }
}

export default function middleware(request) {
  if (isAuthorized(request)) {
    return;
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Mission Control"',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: ['/((?!_vercel|favicon.ico).*)'],
};
