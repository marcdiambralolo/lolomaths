import { NextRequest, NextResponse } from 'next/server';

export const ACCESS_TOKEN_COOKIE = 'monetoile_access_token';
export const REFRESH_TOKEN_COOKIE = 'monetoile_refresh_token';

const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function stripTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '');
}

export function getBackendApiUrl(pathname: string) {
  // ✅ CORRECTION : En production, utiliser /api/v1 sans duplication
  const isProduction = process.env.NODE_ENV === 'production';
  let rawBaseUrl: string;

  if (isProduction) {
    rawBaseUrl = '/api/v1';
  } else {
    rawBaseUrl = 'http://localhost:3001/api/v1'
  }

  const cleanBaseURL = stripTrailingSlashes(rawBaseUrl);
  const normalizedPath = pathname.replace(/^\/+/, '');

  return `${cleanBaseURL}/${normalizedPath}`;
}

export function getRequestSessionTokens(request: NextRequest) {
  return {
    accessToken: request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null,
    refreshToken: request.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null,
  };
}

function isSecureCookie(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedProto) {
    return forwardedProto === 'https';
  }

  return request.nextUrl.protocol === 'https:';
}

function buildCookieOptions(request: NextRequest, maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isSecureCookie(request),
    path: '/',
    maxAge,
  };
}

export function applySessionCookies(
  request: NextRequest,
  response: NextResponse,
  session: { accessToken: string; refreshToken?: string | null },
) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, session.accessToken, buildCookieOptions(request, ACCESS_TOKEN_MAX_AGE_SECONDS));

  if (session.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, session.refreshToken, buildCookieOptions(request, REFRESH_TOKEN_MAX_AGE_SECONDS));
  }
}

export function clearSessionCookies(request: NextRequest, response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', { ...buildCookieOptions(request, 0), expires: new Date(0) });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', { ...buildCookieOptions(request, 0), expires: new Date(0) });
}

export async function refreshBackendSession(refreshToken: string) {
  const response = await fetch(getBackendApiUrl('auth/refresh'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to refresh session');
  }

  return response.json() as Promise<{ accessToken: string; refreshToken?: string }>;
}

export type BackendSessionFetchResult = {
  backendResponse: Response;
  refreshedSession: { accessToken: string; refreshToken?: string } | null;
};