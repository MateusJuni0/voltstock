export default function Loading() {
  return (
    <main className="min-h-screen pt-[120px] pb-20 px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Hero skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-10 w-3/4 max-w-[500px] rounded-xl bg-white/5 animate-pulse" />
          <div className="h-5 w-1/2 max-w-[350px] rounded-lg bg-white/5 animate-pulse" />
        </div>

        {/* Featured section skeleton */}
        <div className="mb-16">
          <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="glass-sidebar rounded-2xl p-4 space-y-4"
              >
                <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Content blocks skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-56 rounded-lg bg-white/5 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="glass-sidebar rounded-2xl p-6 space-y-3"
              >
                <div className="h-6 w-2/3 rounded bg-white/5 animate-pulse" />
                <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
