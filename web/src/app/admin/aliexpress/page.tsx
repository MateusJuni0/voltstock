"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, PackageSearch, Search, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface SearchItem {
  ae_product_id: string;
  title: string;
  price: string | null;
  image: string | null;
  url: string | null;
}

interface AeProductRow {
  id: number;
  ae_product_id: string;
  slug: string;
  name: string;
  category: string | null;
  cost_price: number;
  selling_price: number;
  margin_percentage: number;
  main_image: string | null;
  active: boolean;
  imported_at: string;
}

export default function AliExpressAdminPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [importing, setImporting] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [imported, setImported] = useState<AeProductRow[]>([]);
  const [isLoadingImported, setIsLoadingImported] = useState(true);

  const loadImported = useCallback(async () => {
    setIsLoadingImported(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("ae_products")
        .select("id, ae_product_id, slug, name, category, cost_price, selling_price, margin_percentage, main_image, active, imported_at")
        .order("imported_at", { ascending: false })
        .limit(50);
      setImported((data ?? []) as AeProductRow[]);
    } finally {
      setIsLoadingImported(false);
    }
  }, []);

  useEffect(() => {
    loadImported();
  }, [loadImported]);

  const runSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/admin/aliexpress/search?q=${encodeURIComponent(query.trim())}&page=1`);
      const json = (await res.json()) as { items?: SearchItem[]; error?: string };
      if (!res.ok) {
        setSearchError(json.error ?? "Erro na pesquisa");
        setItems([]);
      } else {
        setItems(json.items ?? []);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const importItem = useCallback(async (aeProductId: string) => {
    setImporting((p) => ({ ...p, [aeProductId]: true }));
    try {
      const res = await fetch("/api/admin/aliexpress/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ae_product_id: aeProductId, margin_percentage: 80 }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setToast({ type: "err", msg: json.error ?? "Falha ao importar" });
      } else {
        setToast({ type: "ok", msg: "Produto importado com sucesso" });
        await loadImported();
      }
    } catch (err) {
      setToast({ type: "err", msg: err instanceof Error ? err.message : "Erro" });
    } finally {
      setImporting((p) => ({ ...p, [aeProductId]: false }));
      setTimeout(() => setToast(null), 4000);
    }
  }, [loadImported]);

  const toggleActive = useCallback(async (row: AeProductRow) => {
    const supabase = createClient();
    await supabase.from("ae_products").update({ active: !row.active }).eq("id", row.id);
    await loadImported();
  }, [loadImported]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
          <PackageSearch className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">AliExpress</h1>
          <p className="text-[#A5D6E1]/60 text-sm">
            Pesquisa, importa e gere produtos do catalogo AliExpress Dropshipping.
          </p>
        </div>
      </header>

      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl border flex items-center gap-3 shadow-lg ${
            toast.type === "ok"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/15 border-red-500/30 text-red-300"
          }`}
        >
          {toast.type === "ok" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      <form onSubmit={runSearch} className="glass-sidebar rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-[#A5D6E1]/60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar produtos AliExpress (ex: bateria 12v, lanterna LED, etc.)"
          className="flex-1 bg-transparent text-white placeholder:text-[#A5D6E1]/40 outline-none"
        />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center gap-2"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Pesquisar
        </button>
      </form>

      {searchError && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-300 text-sm">
          {searchError}
        </div>
      )}

      {items.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">
            Resultados ({items.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((it) => (
              <article
                key={it.ae_product_id}
                className="glass-sidebar rounded-2xl overflow-hidden border border-white/5 flex flex-col"
              >
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt={it.title}
                    className="w-full aspect-square object-cover bg-black/30"
                  />
                ) : (
                  <div className="w-full aspect-square bg-black/30 flex items-center justify-center text-[#A5D6E1]/30">
                    sem imagem
                  </div>
                )}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h3 className="text-sm text-white font-medium line-clamp-2 flex-1">{it.title}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-400 font-bold text-base">{it.price ?? "-"} €</span>
                    {it.url && (
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#A5D6E1]/60 hover:text-[#A5D6E1] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> ver
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => importItem(it.ae_product_id)}
                    disabled={importing[it.ae_product_id]}
                    className="w-full py-2 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-sm font-semibold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {importing[it.ae_product_id] ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> A importar...
                      </>
                    ) : (
                      "Importar"
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Ja importados</h2>
        {isLoadingImported ? (
          <div className="flex items-center gap-2 text-[#A5D6E1]/60">
            <Loader2 className="w-4 h-4 animate-spin" /> A carregar...
          </div>
        ) : imported.length === 0 ? (
          <p className="text-[#A5D6E1]/40 text-sm">Ainda nao importaste nenhum produto AE.</p>
        ) : (
          <div className="glass-sidebar rounded-2xl overflow-hidden border border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-[#A5D6E1]/60 uppercase text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Imagem</th>
                  <th className="text-left px-4 py-3 font-medium">Nome</th>
                  <th className="text-left px-4 py-3 font-medium">AE ID</th>
                  <th className="text-right px-4 py-3 font-medium">Custo</th>
                  <th className="text-right px-4 py-3 font-medium">Venda</th>
                  <th className="text-right px-4 py-3 font-medium">Margem</th>
                  <th className="text-center px-4 py-3 font-medium">Activo</th>
                </tr>
              </thead>
              <tbody>
                {imported.map((row) => (
                  <tr key={row.id} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      {row.main_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.main_image}
                          alt={row.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-black/30" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-white max-w-xs">
                      <div className="line-clamp-2">{row.name}</div>
                    </td>
                    <td className="px-4 py-3 text-[#A5D6E1]/60 font-mono text-xs">{row.ae_product_id}</td>
                    <td className="px-4 py-3 text-right text-[#A5D6E1]/80">{row.cost_price} €</td>
                    <td className="px-4 py-3 text-right text-orange-400 font-semibold">{row.selling_price} €</td>
                    <td className="px-4 py-3 text-right text-[#A5D6E1]/60">{row.margin_percentage}%</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleActive(row)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.active
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : "bg-red-500/15 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {row.active ? "Sim" : "Nao"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
