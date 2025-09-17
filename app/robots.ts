import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/sign-in/', '/api/'],
    },
    sitemap: 'https://rank.jonathanbytes.com/sitemap.xml',
    host: 'https://rank.jonathanbytes.com',
  }
}