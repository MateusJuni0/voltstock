"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrustBadges } from "./TrustBadges";
import { PaymentLogos } from "./PaymentLogos";

// ── SVG icons (inline to avoid dependency on icon pack for brand logos) ──────

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = "351961227666";
const EMAIL = "V0ltSt0ck22@gmail.com";

const footerLinks = {
  Produtos: [
    { label: "Processadores", href: "/produtos?categoria=Processadores" },
    { label: "Placas Gráficas", href: "/produtos?categoria=Placas+Gr%C3%A1ficas" },
    { label: "Armazenamento", href: "/produtos?categoria=Armazenamento" },
    { label: "Monitores", href: "/produtos?categoria=Monitores" },
    { label: "Periféricos", href: "/produtos?categoria=Perif%C3%A9ricos" },
    { label: "Ver Tudo", href: "/produtos" },
  ],
  Suporte: [
    { label: "Perguntas Frequentes", href: "/faq" },
    { label: "Pagamentos (MBWay)", href: "/envios" },
    { label: "Envios e Entregas", href: "/envios" },
    { label: "Garantias e Devoluções", href: "/devolucoes" },
    { label: "Contacte-nos", href: "/contacto" },
    { label: "Sobre Nós", href: "/sobre" },
  ],
  Legal: [
    { label: "Termos e Condições", href: "/termos" },
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Política de Devoluções", href: "/devolucoes" },
    { label: "Política de Envios", href: "/envios" },
    { label: "Livro de Reclamações", href: "https://www.livroreclamacoes.pt", external: true },
  ],
};

// ── Component ────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-transparent border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* ── Brand column ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <video
                  src="/logo/voltstock.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover scale-150"
                />
              </div>
              <span
                className="text-xl font-bold tracking-tight text-orange-400"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                VoltStock
              </span>
            </Link>
            <p className="text-sm text-orange-400/40 max-w-sm mb-6 leading-relaxed">
              A referência em componentes, periféricos e estações de trabalho
              profissionais em Portugal. Hardware premium para quem exige mais.
            </p>

            {/* Social + Contact icons */}
            <div className="flex items-center gap-3 mb-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-orange-400/40 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300"
              >
                <WhatsAppIcon size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram (em breve)"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-orange-400/40 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-300"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                aria-label="Email"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-orange-400/40 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-300"
              >
                <MailIcon size={16} />
              </a>
            </div>

            {/* Contact info text */}
            <div className="space-y-1.5 text-xs text-orange-400/35">
              <p>
                <span className="text-orange-400/50">WhatsApp:</span>{" "}
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="hover:text-green-400 transition-colors">
                  +351 961 227 666
                </a>
              </p>
              <p>
                <span className="text-orange-400/50">Email:</span>{" "}
                <a href={`mailto:${EMAIL}`} className="hover:text-orange-400 transition-colors">
                  {EMAIL}
                </a>
              </p>
            </div>
          </motion.div>

          {/* ── Link columns ── */}
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIdx * 0.1, duration: 0.5 }}
            >
              <h4
                className="text-sm font-bold text-orange-400 mb-5"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => {
                  const isExternal = "external" in link && link.external;
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-400/40 hover:text-orange-400 transition-colors duration-300"
                        >
                          {link.label}
                        </a>
                      ) : link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-400/40 hover:text-orange-400 transition-colors duration-300"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-orange-400/40 hover:text-orange-400 transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Trust & Payment strip ── */}
        <div className="mb-8">
          <TrustBadges />
        </div>

        <div className="mb-8 flex justify-center">
          <PaymentLogos size="md" />
        </div>

        {/* ── Legal info + Livro de Reclamações ── */}
        <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-5">
          {/* Company legal info */}
          <p className="text-[11px] text-orange-400/30 text-center">
            CMTecnologia, Lda. | NIF: 311848710 | Portugal
          </p>

          {/* Livro de Reclamações badge */}
          <a
            href="https://www.livroreclamacoes.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-accent/10 text-orange-400/50 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300"
          >
            <span className="text-base" role="img" aria-label="Livro de Reclamações">
              {"\uD83D\uDCD5"}
            </span>
            <span className="text-xs font-semibold">
              Livro de Reclamações Eletrónico
            </span>
          </a>

          {/* Legal links row */}
          <div className="flex items-center gap-6 text-xs text-orange-400/30">
            <Link href="/termos" className="hover:text-orange-400 transition-colors">
              Termos
            </Link>
            <Link href="/privacidade" className="hover:text-orange-400 transition-colors">
              Privacidade
            </Link>
            <Link href="/devolucoes" className="hover:text-orange-400 transition-colors">
              Devoluções
            </Link>
            <Link href="/envios" className="hover:text-orange-400 transition-colors">
              Envios
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-orange-400/30 text-center">
            &copy; {new Date().getFullYear()} VoltStock. Todos os direitos
            reservados. Preços incluem IVA à taxa legal.
          </p>
        </div>
      </div>
    </footer>
  );
}
