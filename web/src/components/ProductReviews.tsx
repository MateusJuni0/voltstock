"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, Loader2, CheckCircle, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ── Types ───────────────────────────────────────────────────────────────────

interface Review {
  id: number;
  product_id: number;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ProductReviewsProps {
  productId: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ── Star Rating Display ─────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < rating ? "text-amber-400 fill-amber-400" : "text-orange-400/15",
          )}
        />
      ))}
    </div>
  );
}

// ── Star Rating Selector ────────────────────────────────────────────────────

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hovered || value);

        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(starValue)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={cn(
                "transition-colors duration-150",
                isActive
                  ? "text-amber-400 fill-amber-400"
                  : "text-orange-400/20 hover:text-orange-400/40",
              )}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-orange-400/60">
          {value}/5
        </span>
      )}
    </div>
  );
}

// ── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="p-6 rounded-2xl bg-white/[0.03] border border-orange-400/10 backdrop-blur-sm hover:border-orange-400/20 transition-colors duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-orange-400/10 border border-orange-400/15 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-orange-400/70">
            {getInitials(review.author_name)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className="text-sm font-bold text-orange-400">
              {review.author_name}
            </span>
            {review.is_verified_purchase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck size={10} />
                Compra verificada
              </span>
            )}
          </div>

          {/* Rating + Date */}
          <div className="flex items-center gap-3 mb-3">
            <StarRating rating={review.rating} size={14} />
            <span className="text-xs text-orange-400/30">
              {formatDate(review.created_at)}
            </span>
          </div>

          {/* Title + Body */}
          <h4 className="text-sm font-bold text-orange-400/90 mb-1.5">
            {review.title}
          </h4>
          <p className="text-sm text-orange-400/60 leading-relaxed whitespace-pre-line">
            {review.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Rating Summary Bar ──────────────────────────────────────────────────────

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  if (total === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  const counts = [0, 0, 0, 0, 0];
  for (const r of reviews) {
    counts[r.rating - 1]++;
  }

  return (
    <div className="flex flex-col sm:flex-row items-start gap-8 p-6 rounded-2xl bg-white/[0.02] border border-orange-400/10 mb-8">
      {/* Average */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <span className="text-5xl font-black text-orange-400">
          {avg.toFixed(1)}
        </span>
        <StarRating rating={Math.round(avg)} size={18} />
        <span className="text-xs text-orange-400/40 font-medium">
          {total} {total === 1 ? "avaliacao" : "avaliacoes"}
        </span>
      </div>

      {/* Bars */}
      <div className="flex-1 w-full space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star - 1];
          const pct = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs text-orange-400/50 font-bold w-3 text-right">
                {star}
              </span>
              <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
              <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: (5 - star) * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                />
              </div>
              <span className="text-xs text-orange-400/30 font-medium w-6 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Check auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?product_id=${productId}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch {
      // Silently fail — reviews are non-critical
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (rating === 0) {
      setFormError("Seleciona uma classificacao.");
      return;
    }

    if (title.trim().length < 3) {
      setFormError("O titulo deve ter pelo menos 3 caracteres.");
      return;
    }

    if (body.trim().length < 10) {
      setFormError("A avaliacao deve ter pelo menos 10 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          title: title.trim(),
          body: body.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error ?? "Erro ao submeter. Tenta novamente.");
        return;
      }

      setSubmitted(true);
      setRating(0);
      setTitle("");
      setBody("");

      // Auto-hide success after a few seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormOpen(false);
      }, 4000);
    } catch {
      setFormError("Erro de rede. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} className="text-orange-400/60" />
          <h2
            className="text-2xl md:text-3xl font-extrabold text-orange-400"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Avaliacoes
          </h2>
          {reviews.length > 0 && (
            <span className="text-sm text-orange-400/40 font-medium">
              ({reviews.length})
            </span>
          )}
        </div>

        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-orange-400/10 border border-orange-400/20 text-orange-400 text-sm font-bold hover:bg-orange-400/15 transition-colors"
          >
            Escrever Avaliacao
          </button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mb-8"
          >
            {!isLoggedIn ? (
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-orange-400/10 text-center">
                <User size={32} className="text-orange-400/40 mx-auto mb-3" />
                <p className="text-sm text-orange-400/60 mb-4">
                  Tens de iniciar sessao para escrever uma avaliacao.
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-[#0A0E1A] text-sm font-bold hover:bg-accent/90 transition-colors"
                >
                  Iniciar Sessao
                </a>
              </div>
            ) : submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center"
              >
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
                <p className="text-sm text-emerald-400 font-bold">
                  Avaliacao submetida com sucesso!
                </p>
                <p className="text-xs text-emerald-400/60 mt-1">
                  Sera visivel apos aprovacao pela nossa equipa.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 rounded-2xl bg-white/[0.03] border border-orange-400/10 space-y-5"
              >
                {/* Rating */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-orange-400/40 font-bold mb-2">
                    Classificacao *
                  </label>
                  <StarSelector value={rating} onChange={setRating} />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-orange-400/40 font-bold mb-2">
                    Titulo *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Resume a tua experiencia..."
                    maxLength={120}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-orange-400/10 text-orange-400 placeholder:text-orange-400/20 text-sm focus:outline-none focus:border-orange-400/30 focus:ring-1 focus:ring-orange-400/20 transition-colors"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-orange-400/40 font-bold mb-2">
                    Avaliacao *
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Conta-nos mais sobre a tua experiencia com este produto..."
                    rows={4}
                    maxLength={2000}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-orange-400/10 text-orange-400 placeholder:text-orange-400/20 text-sm focus:outline-none focus:border-orange-400/30 focus:ring-1 focus:ring-orange-400/20 transition-colors resize-none"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-orange-400/20">
                      {body.length}/2000
                    </span>
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <p className="text-sm text-red-400 font-medium">{formError}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-[#0A0E1A] text-sm font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        A submeter...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submeter Avaliacao
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormOpen(false);
                      setFormError("");
                    }}
                    className="px-5 py-3 rounded-xl text-orange-400/50 text-sm font-medium hover:text-orange-400/70 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Summary */}
      {!loading && reviews.length > 0 && <RatingSummary reviews={reviews} />}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="text-orange-400/40 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center">
          <MessageSquare
            size={48}
            className="text-orange-400/10 mx-auto mb-4"
          />
          <p className="text-sm text-orange-400/40 font-medium">
            Ainda sem avaliacoes. Se o primeiro!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
