import Link from "next/link";
import { getFeaturedBlog, getBlogsByCategory, getDistinctCategories } from "@/lib/blog-utils";
import { ArrowRight } from "lucide-react"; 
import { FeaturedBlogCard } from "@/components/blog-components/featured-blog-card";
import { BlogCard } from "@/components/blog-components/blog-card";
import { TranslatableText } from "@/components/shared/translatable-text";

export const dynamic = 'force-dynamic'; 

export default async function BlogPage() {
  const featuredBlogData = getFeaturedBlog();
  const categoriesData = getDistinctCategories();

  const [featuredBlog, categories] = await Promise.all([
    featuredBlogData,
    categoriesData
  ]);

  const categorySections = await Promise.all(
    categories.map(async (cat) => ({
      name: cat,
      blogs: await getBlogsByCategory(cat, 4)
    }))
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. TOP NAV: Frameless & Clean */}
      <div className="absolute top-[64px] w-full z-40 bg-white/90 backdrop-blur-xl border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-black tracking-tighter text-gray-900">
               <TranslatableText text="Revuzza / Journal" />
            </h1>

            <div className="flex items-center gap-10 overflow-x-auto no-scrollbar">
              <Link 
                  href="/blog" 
                  className="text-[11px] font-bold uppercase tracking-widest text-[#0ABED6]"
              >
                  <TranslatableText text="Featured" />
              </Link>
              {categories.map((cat) => (
                <Link 
                    key={cat} 
                    href={`#${cat.toLowerCase()}`} 
                    className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <TranslatableText text={cat} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEATURED SECTION: Full Width Background Bleed */}
      {featuredBlog && (
        <section className="w-full bg-white py-16 lg:py-24">
           {/* Inner Container to keep content aligned with Nav and Grids */}
           <div className="max-w-7xl mx-auto px-6">
              <div className="relative z-10">
                 <FeaturedBlogCard blog={featuredBlog} />
              </div>
           </div>
        </section>
      )}

      {/* 3. CATEGORY GRIDS: Spacing as a Divider */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {categorySections.map((section) => (
          section.blogs.length > 0 && (
            <section key={section.name} id={section.name.toLowerCase()} className="scroll-mt-28">
              
              {/* Clean Section Header */}
              <div className="flex items-baseline justify-between mb-12">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight lowercase">
                    <TranslatableText text={section.name} />
                </h2>
                
                <Link 
                  href={`/blog/category/${encodeURIComponent(section.name)}`}
                  className="text-[10px] font-black uppercase tracking-widest text-[#0ABED6] flex items-center gap-2 group"
                >
                  <TranslatableText text="View Category" /> 
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Grid: High Gaps, No Cards/Borders */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                {section.blogs.map((blog) => (
                  <div key={blog.id} className="transition-opacity hover:opacity-80">
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            </section>
          )
        ))}
      </div>
    </div>
  );
}