import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Politica de Envios",
  description:
    "Politica de envios da VoltStock. Informacoes sobre metodos de envio, prazos de entrega, custos e rastreamento de encomendas. Envio gratuito acima de 50 EUR.",
  openGraph: {
    title: "Politica de Envios | VoltStock",
    description:
      "Politica de envios da VoltStock. Informacoes sobre metodos de envio, prazos de entrega, custos e rastreamento de encomendas.",
    url: "https://voltstock.pt/envios",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Politica de Envios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Politica de Envios | VoltStock",
    description:
      "Politica de envios da VoltStock. Envio gratuito acima de 50 EUR para Portugal Continental.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/envios",
  },
};

export default function EnviosPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-20 px-4">
      <div className="max-w-[800px] mx-auto">
        <Breadcrumbs items={[{ label: "Politica de Envios" }]} />

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-orange-400 mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Politica de Envios
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
                Na VoltStock, esforçamo-nos por entregar as suas encomendas da
                forma mais rapida e segura possivel. Abaixo encontra todas as
                informacoes sobre os nossos metodos de envio, prazos e custos.
              </p>
            </div>
          </section>

          {/* 1. Metodos de Envio */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              1. Metodos de Envio
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Todas as encomendas sao expedidas atraves dos{" "}
                <strong className="text-orange-400/90">CTT Expresso</strong>, o
                principal operador de distribuicao expresso em Portugal,
                garantindo rastreamento completo e entrega segura.
              </p>
              <p>
                As encomendas sao processadas e expedidas em dias uteis
                (segunda a sexta-feira, excluindo feriados nacionais).
                Encomendas efetuadas aos fins de semana ou feriados serao
                processadas no dia util seguinte.
              </p>
            </div>
          </section>

          {/* 2. Prazos de Entrega */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              2. Prazos de Entrega
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Os prazos de entrega estimados contam-se a partir da confirmacao
                do pagamento e expedicao da encomenda:
              </p>

              {/* Shipping table */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 pr-4 text-orange-400/90 font-semibold">
                        Destino
                      </th>
                      <th className="pb-3 pr-4 text-orange-400/90 font-semibold">
                        Prazo Estimado
                      </th>
                      <th className="pb-3 text-orange-400/90 font-semibold">
                        Custo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-3 pr-4">Portugal Continental</td>
                      <td className="py-3 pr-4">1 a 3 dias uteis</td>
                      <td className="py-3">
                        <span className="text-orange-400 font-medium">
                          4,99 EUR
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Acores e Madeira</td>
                      <td className="py-3 pr-4">3 a 7 dias uteis</td>
                      <td className="py-3">
                        <span className="text-orange-400 font-medium">
                          9,99 EUR
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                Os prazos indicados sao estimativas e podem variar em funcao de
                circunstancias excecionais (ex.: periodos de maior volume, como
                Black Friday ou Natal, ou situacoes de forca maior).
              </p>
            </div>
          </section>

          {/* 3. Envio Gratuito */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              3. Envio Gratuito
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              {/* Highlight box */}
              <div className="glass rounded-xl p-5 border-orange-500/20 border">
                <p className="text-center">
                  <span className="text-lg font-semibold text-orange-400">
                    Envio gratuito
                  </span>{" "}
                  <span className="text-orange-400/70">
                    para encomendas de valor igual ou superior a
                  </span>{" "}
                  <span className="text-2xl font-bold text-orange-400">
                    50,00 EUR
                  </span>
                </p>
              </div>
              <p>
                O envio gratuito aplica-se a encomendas com destino a Portugal
                Continental. Para as Regioes Autonomas dos Acores e da Madeira,
                o envio gratuito aplica-se a encomendas de valor igual ou
                superior a 100,00 EUR.
              </p>
            </div>
          </section>

          {/* 4. Processamento */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              4. Processamento da Encomenda
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Apos a confirmacao do pagamento, a sua encomenda passa pelas
                seguintes etapas:
              </p>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>
                  <strong className="text-orange-400/90">
                    Confirmacao de pagamento
                  </strong>{" "}
                  - Verificacao automatica do pagamento (instantaneo para MBWay e
                  cartao; ate 72h para Multibanco).
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Preparacao
                  </strong>{" "}
                  - A encomenda e preparada e embalada de forma segura
                  (tipicamente no mesmo dia util ou no dia util seguinte).
                </li>
                <li>
                  <strong className="text-orange-400/90">Expedicao</strong> - A
                  encomenda e entregue aos CTT Expresso e e enviado um email com
                  o numero de rastreamento.
                </li>
                <li>
                  <strong className="text-orange-400/90">Em transito</strong> - Pode
                  acompanhar o estado da encomenda em tempo real.
                </li>
                <li>
                  <strong className="text-orange-400/90">Entregue</strong> -
                  Entrega na morada indicada.
                </li>
              </ol>
            </div>
          </section>

          {/* 5. Rastreamento */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              5. Rastreamento de Encomendas
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Todas as encomendas sao enviadas com rastreamento completo. Apos
                a expedicao, recebera um email com:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>O numero de rastreamento da encomenda.</li>
                <li>
                  Um link direto para acompanhar a encomenda no site dos CTT.
                </li>
              </ul>
              <p>
                Pode tambem consultar o estado da sua encomenda na sua{" "}
                <Link
                  href="/conta/encomendas"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  area de cliente
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 6. Problemas com Entrega */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              6. Problemas com a Entrega
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Se encontrar algum problema com a sua entrega, contacte-nos o
                mais rapidamente possivel:
              </p>

              <div className="space-y-4 mt-3">
                <div className="glass rounded-xl p-4">
                  <h3 className="text-orange-400/90 font-medium mb-2">
                    Encomenda danificada
                  </h3>
                  <p>
                    Se a embalagem apresentar danos visiveis no momento da
                    entrega, recomendamos que recuse a encomenda junto do
                    estafeta. Caso ja tenha aceite, contacte-nos no prazo de 48
                    horas com fotografias dos danos.
                  </p>
                </div>

                <div className="glass rounded-xl p-4">
                  <h3 className="text-orange-400/90 font-medium mb-2">
                    Encomenda extraviada
                  </h3>
                  <p>
                    Se a encomenda nao for entregue dentro do prazo estimado, ou
                    se o rastreamento indicar &quot;entregue&quot; mas nao recebeu a
                    encomenda, contacte-nos e trataremos do assunto junto dos
                    CTT.
                  </p>
                </div>

                <div className="glass rounded-xl p-4">
                  <h3 className="text-orange-400/90 font-medium mb-2">
                    Produto errado
                  </h3>
                  <p>
                    Se recebeu um produto diferente do que encomendou,
                    contacte-nos imediatamente. Enviaremos o produto correto e
                    organizaremos a recolha do produto errado sem custos
                    adicionais.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Contacto */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              7. Contacto
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Para qualquer questao relacionada com envios e entregas:
              </p>
              <div className="glass rounded-xl p-5 space-y-2 mt-3">
                <p>
                  <strong className="text-orange-400/90">Email:</strong>{" "}
                  <span className="text-orange-400">[INSERIR EMAIL]</span>
                </p>
                <p>
                  <strong className="text-orange-400/90">Horario de atendimento:</strong>{" "}
                  Segunda a sexta-feira, das 9h00 as 18h00.
                </p>
              </div>
              <p className="mt-4">
                Consulte tambem a nossa{" "}
                <Link
                  href="/devolucoes"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  Politica de Devolucoes
                </Link>{" "}
                caso precise devolver algum produto.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
