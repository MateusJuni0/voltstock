import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Termos e Condicoes",
  description:
    "Termos e condicoes gerais de venda da VoltStock. Informacoes sobre encomendas, pagamentos, envios, devolucoes e garantias.",
  openGraph: {
    title: "Termos e Condicoes | VoltStock",
    description:
      "Termos e condicoes gerais de venda da VoltStock. Informacoes sobre encomendas, pagamentos, envios, devolucoes e garantias.",
    url: "https://voltstock.pt/termos",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Termos e Condicoes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Termos e Condicoes | VoltStock",
    description:
      "Termos e condicoes gerais de venda da VoltStock.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/termos",
  },
};

export default function TermosPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-20 px-4">
      <div className="max-w-[800px] mx-auto">
        <Breadcrumbs items={[{ label: "Termos e Condicoes" }]} />

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-orange-400 mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Termos e Condicoes
          </h1>
          <p className="text-orange-400/50 text-sm">
            Ultima atualizacao: 30 de marco de 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass-sidebar rounded-2xl p-8 md:p-10 space-y-10">
          {/* 1. Identificacao */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              1. Identificacao do Vendedor
            </h2>
            <div className="text-orange-400/70 space-y-2 text-sm leading-relaxed">
              <p>
                <strong className="text-orange-400/90">Denominacao social:</strong>{" "}
                CM Tecnologia, Unipessoal Lda.
              </p>
              <p>
                <strong className="text-orange-400/90">Nome comercial:</strong>{" "}
                VoltStock
              </p>
              <p>
                <strong className="text-orange-400/90">NIF:</strong> [INSERIR NIF]
              </p>
              <p>
                <strong className="text-orange-400/90">Sede:</strong> [INSERIR
                MORADA]
              </p>
              <p>
                <strong className="text-orange-400/90">Email:</strong> [INSERIR
                EMAIL]
              </p>
              <p>
                <strong className="text-orange-400/90">
                  Inscricao no Livro de Reclamacoes Online:
                </strong>{" "}
                <a
                  href="https://www.livroreclamacoes.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  www.livroreclamacoes.pt
                </a>
              </p>
            </div>
          </section>

          {/* 2. Condicoes Gerais */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              2. Condicoes Gerais de Venda
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Os presentes Termos e Condicoes regulam a venda de produtos
                atraves da loja online VoltStock, acessivel em{" "}
                <span className="text-orange-400">voltstock.pt</span>,
                propriedade de CM Tecnologia, Unipessoal Lda.
              </p>
              <p>
                Ao efetuar uma encomenda na VoltStock, o cliente declara ter lido
                e aceite integralmente os presentes Termos e Condicoes. O
                contrato de compra e venda considera-se celebrado no momento em
                que o cliente recebe a confirmacao da encomenda por email.
              </p>
              <p>
                A VoltStock reserva-se o direito de alterar os presentes termos a
                qualquer momento, sendo as alteracoes aplicaveis apenas a
                encomendas efetuadas apos a data de publicacao.
              </p>
            </div>
          </section>

          {/* 3. Precos e IVA */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              3. Precos e IVA
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Todos os precos apresentados na loja online VoltStock incluem IVA
                a taxa legal em vigor em Portugal (atualmente 23% para a
                generalidade dos produtos).
              </p>
              <p>
                Os precos podem ser alterados a qualquer momento sem aviso
                previo, sendo aplicavel o preco vigente no momento da realizacao
                da encomenda.
              </p>
              <p>
                Os custos de envio nao estao incluidos no preco dos produtos e
                serao indicados antes da confirmacao da encomenda. Para mais
                informacoes, consulte a nossa{" "}
                <Link
                  href="/envios"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  Politica de Envios
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 4. Processo de Encomenda */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              4. Processo de Encomenda
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>O processo de compra na VoltStock segue os seguintes passos:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>
                  Selecao dos produtos desejados e adicao ao carrinho de
                  compras.
                </li>
                <li>
                  Revisao do carrinho e confirmacao dos artigos e quantidades.
                </li>
                <li>
                  Preenchimento dos dados de entrega e faturacao (ou inicio de
                  sessao na conta do cliente).
                </li>
                <li>Selecao do metodo de pagamento.</li>
                <li>Revisao final e confirmacao da encomenda.</li>
                <li>
                  Rececao de email de confirmacao com o resumo da encomenda.
                </li>
              </ol>
              <p>
                A VoltStock reserva-se o direito de recusar ou cancelar qualquer
                encomenda por motivos legitimos, incluindo erros de preco,
                indisponibilidade de stock ou suspeita de fraude.
              </p>
            </div>
          </section>

          {/* 5. Pagamentos */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              5. Metodos de Pagamento
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                A VoltStock disponibiliza os seguintes metodos de pagamento:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">MBWay</strong> - Pagamento
                  instantaneo atraves da aplicacao MBWay.
                </li>
                <li>
                  <strong className="text-orange-400/90">Multibanco</strong> -
                  Referencia Multibanco com validade de 72 horas.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Cartao de Credito/Debito
                  </strong>{" "}
                  - Visa, Mastercard e outros cartoes aceites, processados de
                  forma segura via Stripe.
                </li>
              </ul>
              <p>
                Todos os pagamentos sao processados de forma segura. Os dados de
                pagamento sao encriptados e nunca sao armazenados nos nossos
                servidores.
              </p>
            </div>
          </section>

          {/* 6. Envio e Entrega */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              6. Envio e Entrega
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                As encomendas sao expedidas apos confirmacao do pagamento. Os
                prazos e custos de entrega dependem do destino:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">
                    Portugal Continental:
                  </strong>{" "}
                  1 a 3 dias uteis.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Acores e Madeira:
                  </strong>{" "}
                  3 a 7 dias uteis.
                </li>
              </ul>
              <p>
                O envio e gratuito para encomendas de valor igual ou superior a
                50,00 EUR. Para informacoes detalhadas, consulte a nossa{" "}
                <Link
                  href="/envios"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  Politica de Envios
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 7. Direito de Resolucao */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              7. Direito de Livre Resolucao
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Nos termos do Decreto-Lei n.o 24/2014, de 14 de fevereiro, o
                consumidor tem o direito de resolver livremente o contrato no
                prazo de <strong className="text-orange-400/90">14 dias</strong>{" "}
                seguidos, contados a partir do dia em que o consumidor ou um
                terceiro por ele indicado (que nao seja o transportador) adquira
                a posse fisica dos bens.
              </p>
              <p>
                Para exercer o direito de livre resolucao, o cliente deve
                comunicar a sua decisao de forma inequivoca, enviando email para{" "}
                <span className="text-orange-400">[INSERIR EMAIL]</span>,
                indicando o numero da encomenda e os produtos a devolver.
              </p>
              <p>
                Para mais informacoes sobre o processo de devolucao, consulte a
                nossa{" "}
                <Link
                  href="/devolucoes"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  Politica de Devolucoes
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 8. Garantias */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              8. Garantias
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Todos os produtos comercializados pela VoltStock beneficiam de
                uma garantia legal de{" "}
                <strong className="text-orange-400/90">2 (dois) anos</strong>, nos
                termos do Decreto-Lei n.o 67/2003, de 8 de abril, alterado pelo
                Decreto-Lei n.o 84/2021, de 18 de outubro, em conformidade com a
                Diretiva (UE) 2019/771.
              </p>
              <p>
                Em caso de falta de conformidade do produto, o consumidor tem
                direito a reposicao da conformidade, reducao do preco ou
                resolucao do contrato, nos termos legais.
              </p>
              <p>
                Para acionar a garantia, o cliente deve contactar-nos por email
                para{" "}
                <span className="text-orange-400">[INSERIR EMAIL]</span>,
                indicando o numero da encomenda, o produto em causa e uma
                descricao do defeito.
              </p>
            </div>
          </section>

          {/* 9. Responsabilidade */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              9. Limitacao de Responsabilidade
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                A VoltStock nao sera responsavel por quaisquer danos indiretos,
                incidentais ou consequenciais resultantes da utilizacao ou
                impossibilidade de utilizacao dos produtos adquiridos, salvo nos
                casos previstos na lei.
              </p>
              <p>
                A VoltStock nao se responsabiliza por atrasos na entrega
                causados por circunstancias de forca maior, incluindo, mas nao
                se limitando a, greves, catastrofes naturais, pandemias ou
                decisoes governamentais.
              </p>
            </div>
          </section>

          {/* 10. Resolucao de Litigios */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              10. Resolucao de Litigios
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Em caso de litigio, o consumidor pode recorrer a uma entidade de
                resolucao alternativa de litigios de consumo:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-orange-400/90">CNIACC</strong> - Centro
                  Nacional de Informacao e Arbitragem de Conflitos de Consumo -{" "}
                  <a
                    href="https://www.cniacc.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                  >
                    www.cniacc.pt
                  </a>
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Plataforma de Resolucao de Litigios em Linha da UE
                  </strong>{" "}
                  -{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                </li>
              </ul>
              <p>
                Mais informacoes sobre os mecanismos de resolucao de litigios
                estao disponiveis no Portal do Consumidor:{" "}
                <a
                  href="https://www.consumidor.gov.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  www.consumidor.gov.pt
                </a>
                .
              </p>
            </div>
          </section>

          {/* 11. Lei Aplicavel */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              11. Lei Aplicavel
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Os presentes Termos e Condicoes regem-se pela legislacao
                portuguesa. Para qualquer litigio emergente da interpretacao ou
                execucao dos presentes termos sera competente o foro da comarca
                da sede do vendedor, sem prejuizo de normas legais imperativas
                aplicaveis.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
