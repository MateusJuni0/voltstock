"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-PT">
      <body className="min-h-screen flex items-center justify-center bg-[#0A0E1A] text-[#FED7AA] px-4">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-orange-400">
              Algo correu mal
            </h1>
            <p className="text-orange-400/60 text-sm leading-relaxed">
              Pedimos desculpa pelo incomodo. Por favor tente novamente.
            </p>
            {error.digest && (
              <p className="text-orange-400/30 text-xs font-mono">
                Ref: {error.digest}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
            >
              Tentar Novamente
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-orange-400/70 hover:text-orange-400 font-medium text-sm transition-all duration-200 text-center"
            >
              Voltar a Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
