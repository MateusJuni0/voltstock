export default function ContaLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="h-4 w-20 skeleton-shimmer rounded mb-3" />
        <div className="h-10 w-72 skeleton-shimmer rounded-lg mb-2" />
        <div className="h-5 w-80 skeleton-shimmer rounded-lg" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-card-immersive rounded-2xl p-5 h-[130px] skeleton-shimmer"
          />
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="glass-card-immersive rounded-xl h-11 skeleton-shimmer"
          />
        ))}
      </div>

      {/* Content */}
      <div className="glass-card-immersive rounded-2xl p-12 h-52 skeleton-shimmer" />
    </div>
  );
}
