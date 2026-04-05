import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/conta', '/api', '/auth', '/checkout'],
    },
    sitemap: 'https://voltstock.pt/sitemap.xml',
  }
}
