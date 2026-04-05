import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./types/roles";

const PUBLIC_ROUTES = ["/Login", "/Register", "/not-allowed"];

const ROLE_ROUTES: Record<UserRole, string[]> = {
  FARMER: ["/farmer/dashboard", "/profile", "/Cart", "/Checkout","/"],
  BUYER: ["/marketplace", "/Cart", "/Checkout","/"],
  TRANSPORTER: ["/Transporter/dashboard/missions", "/Cart", "/Checkout","/"],
  ADMIN: ["/Ministry/dashboard","/"],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access");
  const roleCookie = req.cookies.get("role");

  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ✅ Not logged in
  if (!token || !roleCookie) {
    if (!isPublic) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }
    return NextResponse.next();
  }

  // ✅ Get role (NO JSON.parse)
  const role = roleCookie.value.replace(/"/g, "").trim() as UserRole;
  const allowedRoutes = ROLE_ROUTES[role] || [];  
  const isAllowed = allowedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAllowed && !isPublic) {
    return NextResponse.redirect(new URL("/not-allowed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};