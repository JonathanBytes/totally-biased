import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // const url = req.nextUrl.clone()
    // url.pathname = '/sign-in'
    // await auth.protect({ unauthenticatedUrl: url.toString() })
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals, SEO files (robots.txt, sitemap.xml) and all static files, unless found in search params
    '/((?!_next|robots\\.txt|sitemap\\.xml|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
