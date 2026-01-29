import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("accessToken")?.value ||
        request.headers.get("authorization")?.replace("Bearer ", "");

    const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/register");
    const isAppPage = request.nextUrl.pathname.startsWith("/app");

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/app", request.url));
    }

    // Redirect unauthenticated users to login
    if (isAppPage && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*", "/login", "/register"],
};
