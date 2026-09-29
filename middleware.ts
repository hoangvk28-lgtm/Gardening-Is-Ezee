import { NextRequest, NextResponse } from "next/server";

// Bots that ignore robots.txt disallow rules and crawl aggressively for
// AI-training data without sending real user traffic back. Blocked at the
// edge (before ISR is touched) since they were driving a large share of
// billed ISR Read Units.
const BLOCKED_USER_AGENTS = [/Bytespider/i, /CCBot/i];

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (BLOCKED_USER_AGENTS.some((re) => re.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
