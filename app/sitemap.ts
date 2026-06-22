import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:3000'

type SitemapEntry = MetadataRoute.Sitemap[0]

/**
 * ✅ ONLY public + SEO pages
 */
const STATIC_ROUTES: Array<{
  path: string
  priority: number
  frequency: SitemapEntry['changeFrequency']
}> = [
  { path: '', priority: 1.0, frequency: 'daily' },
  { path: '/about', priority: 0.7, frequency: 'monthly' },
  { path: '/contact', priority: 0.7, frequency: 'monthly' },
  { path: '/revuzza', priority: 0.7, frequency: 'weekly' },

  { path: '/blog', priority: 0.9, frequency: 'daily' },
  { path: '/categories', priority: 0.9, frequency: 'daily' },

  { path: '/business', priority: 0.8, frequency: 'monthly' },
  { path: '/business/plans', priority: 0.7, frequency: 'monthly' },
  { path: '/business/features', priority: 0.7, frequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const staticUrls = STATIC_ROUTES.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.frequency,
      priority: route.priority,
    }))

    // 🔥 Fetch dynamic data in parallel
    const [blogs, companies, categories] = await Promise.all([
      fetchBlogs(),
      fetchCompanies(),
      fetchCategories(),
    ])

    const dynamicUrls = [...blogs, ...companies, ...categories]

    return [...staticUrls, ...dynamicUrls]
  } catch (error) {
    console.error('Sitemap error:', error)

    // fallback → at least static pages
    return STATIC_ROUTES.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.frequency,
      priority: route.priority,
    }))
  }
}

/**
 * 📝 Blogs
 */
async function fetchBlogs(): Promise<SitemapEntry[]> {
  try {
    const blogs = await prisma.blog.findMany({
      select: { blogUrl: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    })

    return blogs.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.blogUrl}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Blogs sitemap error:', error)
    return []
  }
}

/**
 * 🏢 Companies
 */
async function fetchCompanies(): Promise<SitemapEntry[]> {
  try {
    const companies = await prisma.company.findMany({
      where: { claimed: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 10000,
    })

return companies.map((company) => ({
  url: `${BASE_URL}/company/${company.slug}`,
  lastModified: company.updatedAt ?? new Date(),
  changeFrequency: 'weekly',
  priority: 0.85,
}))
  } catch (error) {
    console.error('Companies sitemap error:', error)
    return []
  }
}

/**
 * 📂 Categories + Subcategories
 */
async function fetchCategories(): Promise<SitemapEntry[]> {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    const subCategories = await prisma.subCategory.findMany({
      select: {
        slug: true,
        category: { select: { slug: true } },
      },
    });

    const categoryUrls = categories.map((cat) => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified: new Date(), // fallback (since no updatedAt)
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    const subCategoryUrls = subCategories
      .filter((sub) => sub.category) // safety check
      .map((sub) => ({
        url: `${BASE_URL}/categories/${sub.category.slug}/${sub.slug}`,
        lastModified: new Date(), // fallback
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));

    return [...categoryUrls, ...subCategoryUrls];
  } catch (error) {
    console.error('Categories sitemap error:', error);
    return [];
  }
}