export default function ProdutosLoading() {
  return (
    <main className="min-h-screen pt-[120px] pb-20 px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="h-9 w-40 rounded-xl bg-white/5 animate-pulse mb-8" />

        {/* Title skeleton */}
        <div className="h-9 w-64 rounded-lg bg-white/5 animate-pulse mb-8" />

        {/* Filters skeleton */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-white/5 animate-pulse"
              style={{ width: `${80 + i * 20}px` }}
            />
          ))}
        </div>

        {/* Product grid skeleton (3x4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="glass-sidebar rounded-2xl p-4 space-y-4"
            >
              {/* Image placeholder */}
              <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
              {/* Title */}
              <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
              {/* Category */}
              <div className="h-3 w-1/3 rounded bg-white/5 animate-pulse" />
              {/* Price row */}
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-24 rounded bg-white/5 animate-pulse" />
                <div className="h-9 w-9 rounded-lg bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
