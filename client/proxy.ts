// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./types/roles";

const PUBLIC_ROUTES = ["/Login", "/Register", "/not-allowed"];

const ROLE_ROUTES: Record<UserRole, string[]> = {
  FARMER: ["/farmer", "/marketplace" ,"/farmer/profile", "/Cart", "/Checkout", "/"],
  BUYER: ["/marketplace", "/buyer/profile", "/Cart", "/Checkout", "/"],
  TRANSPORTER: ["/transporter", "/transporter/profile", "/Cart", "/Checkout", "/"],
  ADMIN: ["/Ministry/dashboard", "/"],
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access");
  const roleCookie = req.cookies.get("role");
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!token || !roleCookie) {
    if (!isPublic) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }
    return NextResponse.next();
  }
const role = roleCookie.value.replace(/"/g, "").trim() as UserRole;
  const lowerRole = role.toLowerCase();

  // Handle the special /profile proxy rewrite
  if (pathname === "/profile") {
    return NextResponse.rewrite(new URL(`/${lowerRole}/profile`, req.url));
  }

  const allowedRoutes = ROLE_ROUTES[role] || [];
  
  // FIXED LOGIC:
  const isAllowed = allowedRoutes.some((route) => {
    const p = pathname.toLowerCase();
    const r = route.toLowerCase();
    return r === "/" ? p === "/" : p.startsWith(r);
  });

  if (!isAllowed && !isPublic) {
    console.log(`[Auth Guard] Blocked ${role} from accessing ${pathname}`);
    return NextResponse.redirect(new URL("/not-allowed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};