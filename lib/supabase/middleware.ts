import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Creates a Supabase client configured for use in proxy.ts (Next.js 16 middleware).
 * Handles cookie forwarding between request ↔ response so auth sessions
 * stay in sync across SSR, client, and proxy layers.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Use getUser() instead of getSession() for security.
  // getUser() validates the JWT against the Supabase Auth server,
  // while getSession() only reads from potentially-spoofed cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth/callback"];
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isPublic =
    publicPaths.includes(request.nextUrl.pathname) || isAuthPage;

  // Redirect unauthenticated users away from protected routes
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup pages
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: Return supabaseResponse as-is. Creating a new
  // NextResponse without forwarding the cookie updates causes
  // session desync between browser ↔ server.
  return supabaseResponse;
}
