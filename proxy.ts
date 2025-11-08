import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const currentUser = request.cookies.get("currentUser")?.value

  const publicRoutes = ["/auth/login", "/auth/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Se não tem usuário e tenta acessar rota protegida
  if (!currentUser && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Se tem usuário e tenta acessar rota pública
  if (currentUser && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
