import { getNeonAuth } from "@/lib/auth/server";

const notConfigured = () =>
  new Response(
    "Neon Auth is not configured. Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET (at least 32 characters) in .env.local. See https://github.com/neondatabase/neon-js/blob/main/packages/auth/NEXT-JS.md",
    { status: 503 }
  );

const bundle = getNeonAuth()?.handler();

export const GET = bundle
  ? bundle.GET.bind(bundle)
  : () => notConfigured();

export const POST = bundle
  ? bundle.POST.bind(bundle)
  : () => notConfigured();
