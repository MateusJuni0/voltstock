export default function ContaLoading() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="glass-sidebar rounded-2xl p-5 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-11 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
            <div className="my-2 border-t border-white/10" />
            <div className="h-11 rounded-xl bg-white/5 animate-pulse" />
          </div>
        </aside>

        {/* Content area skeleton */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Title */}
          <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse" />

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="glass-sidebar rounded-2xl p-6 space-y-3"
              >
                <div className="h-4 w-20 rounded bg-white/5 animate-pulse" />
                <div className="h-8 w-16 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Content block */}
          <div className="glass-sidebar rounded-2xl p-6 space-y-4">
            <div className="h-6 w-40 rounded bg-white/5 animate-pulse" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-white/5 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="h-5 w-20 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
