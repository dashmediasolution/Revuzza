import Image from 'next/image';
// ✅ Import Translator
import { TranslatableText } from "@/components/shared/translatable-text";

export function RatingLogic() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Main Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">
            <TranslatableText text="How Smart Scoring works." />
          </h2>
        </div>

        <div className="space-y-32">

          {/* --- ROW 1: THE STABILIZER --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Text Side */}
            <div className="order-1 lg:order-1 space-y-8">
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                    <TranslatableText text="The 'Stabilizer' Effect" />
                </h3>
                <p className="text-purple-600 font-semibold tracking-wide uppercase text-sm">
                    <TranslatableText text="Trust Anchor Protocol" />
                </p>
              </div>
              
              <div className="space-y-6 text-md text-gray-600 leading-relaxed">
                <p>
                  <TranslatableText text="Every company on our platform starts with" /> <strong>7 <TranslatableText text="hypothetical 'neutral' signals" /></strong> <TranslatableText text="blended into their score. Think of this as a trust anchor." />
                </p>
                <p>
                  <TranslatableText text="Without this safeguard, a brand-new business could manipulate their way to the #1 spot with just a single 5-star review, unfairly outranking veterans with thousands of happy customers." />
                </p>
                <p>
                  <TranslatableText text="We intentionally pull the score toward a safe baseline until a business proves consistency over time. True trust is cumulative." />
                </p>
              </div>
            </div>

            {/* Visual Side (Image Placeholder) */}
            <div className="order-2 lg:order-2">
               <div className="relative h-[400px] w-full bg-white overflow-hidden">
                  <Image 
                    src="/images/stabilizer.png"
                    alt="Stabilizer Effect Graph"
                    fill
                    className="object-cover"
                  />
              </div>
            </div>

          </div>

          {/* --- ROW 2: STRICT VISUALS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Visual Side (Image Placeholder) */}
            <div className="order-2 lg:order-1">
               <div className="relative h-[400px] w-full bg-white overflow-hidden">
                  <Image 
                    src="/images/strict-visual.png" 
                    alt="Strict Visual Grading"
                    fill
                    className="object-cover"
                  />
              </div>
            </div>

            {/* Text Side */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                    <TranslatableText text="Strict Visuals" />
                </h3>
                <p className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                    <TranslatableText text="No Grade Inflation" />
                </p>
              </div>

              <div className="space-y-6 text-md text-gray-600 leading-relaxed">
                <p>
                  <TranslatableText text="Most platforms round up. If a business has a 4.5 rating, they show 5 stars. We believe this is misleading." />
                </p>
                <p>
                  <TranslatableText text="We only display a full star if the rating is truly perfect. If a company has a" /> <strong>4.9 <TranslatableText text="rating" /></strong>, <TranslatableText text="we show" /> <strong>4.5 <TranslatableText text="stars" /></strong> <TranslatableText text="visually." /> 
                </p>
                <p>
                  <TranslatableText text="This keeps expectations realistic. A full 5-star visual rating on our platform is the gold standard of excellence—it means near-absolute perfection, not just 'pretty good'." />
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}