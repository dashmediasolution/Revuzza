import { auth } from "@/auth"
import { NextResponse } from "next/server"

// ✅ Define roles properly
type Role = "USER" | "BUSINESS" | "DATA_ENTRY" | "BLOG_ENTRY" | "ADMIN" 

export default auth((req) => {
  const pathname = req.nextUrl.pathname
  const role = req.auth?.user?.role as Role | undefined

  if (!req.auth) return NextResponse.next()


  // ✅ BUSINESS restriction
  if (role === "BUSINESS") {
    const restricted = ["/admin", "/data-entry", "/blog-entry" , "/dashboard" ]

    if (restricted.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/business", req.nextUrl))
    }
  }

  // ✅ DATA_ENTRY restriction
  if (role === "DATA_ENTRY") {
    const restricted = ["/admin", "/business", "/blog-entry" , "/dashboard"]

    if (restricted.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/data-entry", req.nextUrl))
    }
  }

  // ✅ BLOG_ENTRY restriction
  if (role === "BLOG_ENTRY") {
    const restricted = ["/admin", "/business", "/data-entry" , "/dashboard"]

    if (restricted.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/blog-entry", req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}