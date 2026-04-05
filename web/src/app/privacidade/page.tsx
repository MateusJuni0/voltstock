import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Politica de Privacidade",
  description:
    "Politica de privacidade da VoltStock. Informacoes sobre o tratamento de dados pessoais em conformidade com o RGPD.",
  openGraph: {
    title: "Politica de Privacidade | VoltStock",
    description:
      "Politica de privacidade da VoltStock. Informacoes sobre o tratamento de dados pessoais em conformidade com o RGPD.",
    url: "https://voltstock.pt/privacidade",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Politica de Privacidade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Politica de Privacidade | VoltStock",
    description:
      "Politica de privacidade da VoltStock. Protecao de dados em conformidade com o RGPD.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/privacidade",
  },
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen pt-[120px] pb-20 px-4">
      <div className="max-w-[800px] mx-auto">
        <Breadcrumbs items={[{ label: "Politica de Privacidade" }]} />

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-orange-400 mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Politica de Privacidade
          </h1>
          <p className="text-orange-400/50 text-sm">
            Ultima atualizacao: 30 de marco de 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass-sidebar rounded-2xl p-8 md:p-10 space-y-10">
          {/* Intro */}
          <section>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                A VoltStock, operada por CM Tecnologia, Unipessoal Lda., esta
                empenhada na protecao dos dados pessoais dos seus clientes e
                utilizadores, em conformidade com o Regulamento Geral sobre a
                Protecao de Dados (RGPD - Regulamento (UE) 2016/679) e a Lei
                n.o 58/2019, de 8 de agosto.
              </p>
              <p>
                A presente Politica de Privacidade descreve como recolhemos,
                utilizamos, armazenamos e protegemos os seus dados pessoais
                quando utiliza o nosso website e servicos.
              </p>
            </div>
          </section>

          {/* 1. Responsavel pelo Tratamento */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              1. Responsavel pelo Tratamento
            </h2>
            <div className="text-orange-400/70 space-y-2 text-sm leading-relaxed">
              <p>
                <strong className="text-orange-400/90">Entidade:</strong> CM
                Tecnologia, Unipessoal Lda. (VoltStock)
              </p>
              <p>
                <strong className="text-orange-400/90">NIF:</strong> [INSERIR NIF]
              </p>
              <p>
                <strong className="text-orange-400/90">Morada:</strong> [INSERIR
                MORADA]
              </p>
              <p>
                <strong className="text-orange-400/90">Email:</strong> [INSERIR
                EMAIL]
              </p>
            </div>
          </section>

          {/* 2. Dados Recolhidos */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              2. Dados Pessoais Recolhidos
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                No ambito da utilizacao do nosso website e da realizacao de
                encomendas, podemos recolher os seguintes dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">Dados de identificacao:</strong>{" "}
                  nome completo, NIF (quando solicitado para faturacao).
                </li>
                <li>
                  <strong className="text-orange-400/90">Dados de contacto:</strong>{" "}
                  endereco de email, numero de telefone/telemovel.
                </li>
                <li>
                  <strong className="text-orange-400/90">Dados de morada:</strong>{" "}
                  morada de entrega e morada de faturacao.
                </li>
                <li>
                  <strong className="text-orange-400/90">Dados de transacao:</strong>{" "}
                  historico de encomendas, metodo de pagamento utilizado (sem
                  dados do cartao).
                </li>
                <li>
                  <strong className="text-orange-400/90">Dados tecnicos:</strong>{" "}
                  endereco IP, tipo de navegador, sistema operativo, paginas
                  visitadas.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Finalidade */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              3. Finalidade do Tratamento
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>Os dados pessoais sao tratados para as seguintes finalidades:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Processamento e gestao de encomendas.</li>
                <li>Emissao de faturas e demais documentos fiscais.</li>
                <li>Comunicacao relativa ao estado das encomendas.</li>
                <li>Gestao de devolucoes e garantias.</li>
                <li>Prestacao de apoio ao cliente.</li>
                <li>
                  Envio de comunicacoes de marketing (apenas com consentimento
                  previo).
                </li>
                <li>
                  Melhoria do website e da experiencia de utilizacao.
                </li>
                <li>
                  Cumprimento de obrigacoes legais e fiscais.
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Base Legal */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              4. Base Legal para o Tratamento
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>O tratamento dos seus dados pessoais baseia-se em:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">
                    Execucao de contrato:
                  </strong>{" "}
                  para o processamento de encomendas e prestacao de servicos.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Obrigacao legal:
                  </strong>{" "}
                  para cumprimento de obrigacoes fiscais e contabilisticas.
                </li>
                <li>
                  <strong className="text-orange-400/90">Consentimento:</strong>{" "}
                  para o envio de comunicacoes de marketing e newsletters.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Interesse legitimo:
                  </strong>{" "}
                  para prevencao de fraude e melhoria dos nossos servicos.
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Partilha com Terceiros */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              5. Partilha de Dados com Terceiros
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Os seus dados pessoais podem ser partilhados com as seguintes
                categorias de entidades terceiras, exclusivamente na medida do
                necessario para as finalidades indicadas:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">Stripe, Inc.</strong> -
                  Processamento de pagamentos por cartao. Os dados de pagamento
                  sao tratados diretamente pela Stripe, em conformidade com os
                  padroes PCI-DSS.
                </li>
                <li>
                  <strong className="text-orange-400/90">CTT Expresso</strong> -
                  Transporte e entrega de encomendas. Partilhamos nome, morada e
                  telefone para efeitos de expedicao.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Supabase (Supabase, Inc.)
                  </strong>{" "}
                  - Alojamento da base de dados. Os dados sao armazenados em
                  servidores seguros com encriptacao em transito e em repouso.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Vercel, Inc.
                  </strong>{" "}
                  - Alojamento do website. Pode ter acesso a dados tecnicos
                  (enderecos IP, logs de acesso).
                </li>
              </ul>
              <p>
                Nao vendemos, trocamos ou cedemos os seus dados pessoais a
                terceiros para fins de marketing.
              </p>
            </div>
          </section>

          {/* 6. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              6. Cookies
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                O nosso website utiliza cookies para garantir o seu
                funcionamento, melhorar a experiencia de navegacao e analisar o
                trafego. Utilizamos os seguintes tipos de cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">
                    Cookies essenciais:
                  </strong>{" "}
                  necessarios para o funcionamento do website (sessao, carrinho
                  de compras, autenticacao).
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Cookies analiticos:
                  </strong>{" "}
                  permitem analisar a utilizacao do website para melhorar o
                  servico (ex.: Google Analytics, com anonimizacao de IP).
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Cookies de funcionalidade:
                  </strong>{" "}
                  recordam as suas preferencias (ex.: idioma, tema).
                </li>
              </ul>
              <p>
                Pode gerir as suas preferencias de cookies a qualquer momento
                atraves das definicoes do seu navegador. A desativacao de cookies
                essenciais pode afetar o funcionamento do website.
              </p>
            </div>
          </section>

          {/* 7. Direitos do Titular */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              7. Direitos do Titular dos Dados
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Nos termos do RGPD, o titular dos dados tem os seguintes
                direitos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">Direito de acesso</strong>{" "}
                  - Obter confirmacao de que os seus dados sao tratados e aceder
                  a uma copia dos mesmos.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Direito de retificacao
                  </strong>{" "}
                  - Corrigir dados pessoais inexatos ou incompletos.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Direito ao apagamento
                  </strong>{" "}
                  - Solicitar a eliminacao dos seus dados, quando aplicavel.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Direito a limitacao do tratamento
                  </strong>{" "}
                  - Restringir o tratamento dos seus dados em determinadas
                  circunstancias.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Direito a portabilidade
                  </strong>{" "}
                  - Receber os seus dados num formato estruturado e de uso
                  corrente.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Direito de oposicao
                  </strong>{" "}
                  - Opor-se ao tratamento dos seus dados para fins de marketing
                  direto.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Direito a retirar o consentimento
                  </strong>{" "}
                  - A qualquer momento, sem comprometer a licitude do tratamento
                  ja efetuado.
                </li>
              </ul>
              <p>
                Para exercer qualquer um destes direitos, contacte-nos atraves
                de{" "}
                <span className="text-orange-400">[INSERIR EMAIL]</span>.
                Responderemos no prazo maximo de 30 dias.
              </p>
            </div>
          </section>

          {/* 8. DPO */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              8. Encarregado da Protecao de Dados (DPO)
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Para qualquer questao relacionada com a protecao dos seus dados
                pessoais, pode contactar o nosso Encarregado da Protecao de
                Dados:
              </p>
              <p>
                <strong className="text-orange-400/90">Email:</strong>{" "}
                <span className="text-orange-400">[INSERIR EMAIL]</span>
              </p>
              <p>
                Tem igualmente o direito de apresentar reclamacao junto da
                Comissao Nacional de Protecao de Dados (CNPD):{" "}
                <a
                  href="https://www.cnpd.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  www.cnpd.pt
                </a>
                .
              </p>
            </div>
          </section>

          {/* 9. Retencao de Dados */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              9. Retencao de Dados
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Os dados pessoais sao conservados apenas durante o periodo
                necessario para as finalidades para que foram recolhidos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">Dados de conta:</strong>{" "}
                  enquanto a conta estiver ativa, ou ate ao pedido de eliminacao.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Dados de faturacao:
                  </strong>{" "}
                  10 anos, conforme exigido pela legislacao fiscal portuguesa
                  (Codigo do IRS/IRC).
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Dados de marketing:
                  </strong>{" "}
                  ate a retirada do consentimento ou cancelamento da subscricao.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Cookies e dados tecnicos:
                  </strong>{" "}
                  conforme a duracao indicada na politica de cookies (maximo 13
                  meses para cookies analiticos).
                </li>
              </ul>
              <p>
                Apos o termo do periodo de retencao, os dados sao eliminados ou
                anonimizados de forma irreversivel.
              </p>
            </div>
          </section>

          {/* 10. Seguranca */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              10. Medidas de Seguranca
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Implementamos medidas tecnicas e organizativas adequadas para
                proteger os seus dados pessoais contra acesso nao autorizado,
                perda, destruicao ou alteracao, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Encriptacao SSL/TLS em todas as comunicacoes.</li>
                <li>
                  Armazenamento de dados em servidores seguros com encriptacao
                  em repouso.
                </li>
                <li>Acesso restrito aos dados com base no principio do menor privilegio.</li>
                <li>Auditorias regulares de seguranca.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
