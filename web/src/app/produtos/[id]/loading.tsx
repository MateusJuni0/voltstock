export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen pt-[120px] pb-20 px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="h-9 w-60 rounded-xl bg-white/5 animate-pulse mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            {/* Thumbnail row */}
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Right: Details skeleton */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="h-6 w-20 rounded-full bg-white/5 animate-pulse" />
            {/* Title */}
            <div className="h-8 w-4/5 rounded-lg bg-white/5 animate-pulse" />
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-28 rounded bg-white/5 animate-pulse" />
            </div>
            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 rounded-lg bg-white/5 animate-pulse" />
              <div className="h-6 w-20 rounded bg-white/5 animate-pulse" />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
            </div>
            {/* Features table */}
            <div className="glass-sidebar rounded-xl p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-28 rounded bg-white/5 animate-pulse" />
                  <div className="h-4 w-36 rounded bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
            {/* Add to cart button */}
            <div className="h-12 w-full rounded-xl bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
