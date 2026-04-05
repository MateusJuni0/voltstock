import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Politica de Devolucoes",
  description:
    "Politica de devolucoes da VoltStock. Informacoes sobre o direito de livre resolucao de 14 dias, processo de devolucao e reembolso.",
  openGraph: {
    title: "Politica de Devolucoes | VoltStock",
    description:
      "Politica de devolucoes da VoltStock. Informacoes sobre o direito de livre resolucao, processo de devolucao e reembolso.",
    url: "https://voltstock.pt/devolucoes",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Politica de Devolucoes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Politica de Devolucoes | VoltStock",
    description:
      "Politica de devolucoes da VoltStock. 14 dias para devolucao livre.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/devolucoes",
  },
};

export default function DevolucoesPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-20 px-4">
      <div className="max-w-[800px] mx-auto">
        <Breadcrumbs items={[{ label: "Politica de Devolucoes" }]} />

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-orange-400 mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Politica de Devolucoes
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
                Na VoltStock, queremos que esteja completamente satisfeito com a
                sua compra. Caso nao esteja, pode exercer o seu direito de
                devolucao nos termos descritos abaixo, em conformidade com a
                legislacao portuguesa de protecao do consumidor.
              </p>
            </div>
          </section>

          {/* 1. Direito de Livre Resolucao */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              1. Direito de Livre Resolucao (14 Dias)
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Nos termos do Decreto-Lei n.o 24/2014, de 14 de fevereiro, tem o
                direito de resolver livremente o contrato no prazo de{" "}
                <strong className="text-orange-400/90">14 dias seguidos</strong>,
                sem necessidade de indicar qualquer motivo.
              </p>
              <p>
                O prazo de 14 dias conta-se a partir do dia em que o consumidor
                ou um terceiro por ele indicado (que nao seja o transportador)
                adquira a posse fisica dos bens. No caso de encomendas com
                multiplos artigos entregues separadamente, o prazo conta-se a
                partir da entrega do ultimo artigo.
              </p>
            </div>
          </section>

          {/* 2. Como Devolver */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              2. Como Iniciar uma Devolucao
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>Para devolver um produto, siga estes passos:</p>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>
                  <strong className="text-orange-400/90">
                    Comunique a sua intencao:
                  </strong>{" "}
                  Envie um email para{" "}
                  <a href="mailto:info@voltstock.pt" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200">info@voltstock.pt</a> com o
                  assunto &quot;Devolucao - [Numero da Encomenda]&quot;, indicando os
                  produtos que pretende devolver e o motivo (opcional).
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Aguarde confirmacao:
                  </strong>{" "}
                  Recebera um email com as instrucoes de devolucao e a morada
                  para envio no prazo de 2 dias uteis.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Embale o produto:
                  </strong>{" "}
                  O produto deve ser embalado de forma segura, preferencialmente
                  na embalagem original, incluindo todos os acessorios e
                  documentacao.
                </li>
                <li>
                  <strong className="text-orange-400/90">
                    Envie o produto:
                  </strong>{" "}
                  Envie o produto para a morada indicada no prazo maximo de 14
                  dias apos a comunicacao da intencao de devolucao.
                </li>
              </ol>
            </div>
          </section>

          {/* 3. Condicoes */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              3. Condicoes de Devolucao
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Para que a devolucao seja aceite, o produto deve cumprir as
                seguintes condicoes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  O produto deve estar em estado{" "}
                  <strong className="text-orange-400/90">novo e sem uso</strong>,
                  nas mesmas condicoes em que foi recebido.
                </li>
                <li>
                  Deve incluir a{" "}
                  <strong className="text-orange-400/90">embalagem original</strong>
                  , todos os acessorios, manuais e documentacao.
                </li>
                <li>
                  Os selos de garantia e etiquetas nao devem ter sido removidos
                  ou danificados.
                </li>
                <li>
                  O produto nao deve apresentar sinais de uso, danos fisicos ou
                  alteracoes.
                </li>
              </ul>
              <p>
                O consumidor e responsavel pela diminuicao do valor do bem
                resultante de uma manipulacao que exceda o necessario para
                verificar a natureza, as caracteristicas e o funcionamento do
                produto.
              </p>
            </div>
          </section>

          {/* 4. Custos de Devolucao */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              4. Custos de Devolucao
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Os custos de envio da devolucao sao suportados pelo cliente, a
                menos que o produto tenha sido entregue com defeito, danificado
                ou nao corresponda ao produto encomendado — nestes casos, a
                VoltStock assume os custos de devolucao.
              </p>
            </div>
          </section>

          {/* 5. Reembolso */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              5. Reembolso
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Apos rececao e verificacao do estado do produto devolvido, o
                reembolso sera efetuado nas seguintes condicoes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  O reembolso inclui o valor do produto e os custos de envio
                  iniciais (se aplicavel).
                </li>
                <li>
                  O reembolso sera efetuado atraves do{" "}
                  <strong className="text-orange-400/90">
                    mesmo metodo de pagamento
                  </strong>{" "}
                  utilizado na compra original.
                </li>
                <li>
                  O prazo maximo para reembolso e de{" "}
                  <strong className="text-orange-400/90">14 dias</strong> apos a
                  rececao do produto devolvido ou a prova de envio por parte do
                  consumidor.
                </li>
                <li>
                  A VoltStock pode reter o reembolso ate rececao efetiva dos
                  bens devolvidos.
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Excecoes */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              6. Excecoes ao Direito de Livre Resolucao
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Nos termos do artigo 17.o do Decreto-Lei n.o 24/2014, o direito
                de livre resolucao nao se aplica aos seguintes casos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  Produtos personalizados ou feitos sob medida.
                </li>
                <li>
                  Produtos selados que nao possam ser devolvidos por motivos de
                  protecao da saude ou de higiene e cujo selo tenha sido removido
                  apos a entrega.
                </li>
                <li>
                  Produtos que, apos a entrega, fiquem inseparavelmente
                  misturados com outros bens.
                </li>
                <li>
                  Conteudos digitais nao fornecidos em suporte material, caso a
                  execucao tenha tido inicio com o acordo previo e expresso do
                  consumidor.
                </li>
                <li>
                  Software informatico selado cujo selo de seguranca tenha sido
                  violado apos a entrega.
                </li>
              </ul>
            </div>
          </section>

          {/* 7. Garantia Legal */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              7. Garantia Legal (2 Anos)
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Independentemente do direito de livre resolucao, todos os
                produtos beneficiam de uma garantia legal de{" "}
                <strong className="text-orange-400/90">2 (dois) anos</strong>, nos
                termos do Decreto-Lei n.o 67/2003, alterado pelo Decreto-Lei n.o
                84/2021.
              </p>
              <p>
                Em caso de defeito ou falta de conformidade detetada dentro do
                prazo de garantia, o consumidor tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Reparacao do produto.</li>
                <li>Substituicao por produto identico ou equivalente.</li>
                <li>Reducao do preco.</li>
                <li>Resolucao do contrato (reembolso integral).</li>
              </ul>
              <p>
                Os defeitos que se manifestem nos primeiros{" "}
                <strong className="text-orange-400/90">30 dias</strong> apos a
                entrega presumem-se existentes a data da entrega, podendo o
                consumidor optar imediatamente pela substituicao do produto ou
                resolucao do contrato. Os defeitos que se manifestem no primeiro
                ano presumem-se existentes a data da entrega.
              </p>
            </div>
          </section>

          {/* 8. Contacto */}
          <section>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">
              8. Contacto
            </h2>
            <div className="text-orange-400/70 space-y-3 text-sm leading-relaxed">
              <p>
                Para qualquer questao relacionada com devolucoes ou garantias,
                contacte-nos:
              </p>
              <div className="glass rounded-xl p-5 space-y-2 mt-3">
                <p>
                  <strong className="text-orange-400/90">Email:</strong>{" "}
                  <a href="mailto:info@voltstock.pt" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200">info@voltstock.pt</a>
                </p>
                <p>
                  <strong className="text-orange-400/90">WhatsApp:</strong>{" "}
                  <a href="https://wa.me/351961227666" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-green-400 transition-colors duration-200">+351 961 227 666</a>
                </p>
              </div>
              <p className="mt-4">
                Pode tambem consultar os nossos{" "}
                <Link
                  href="/termos"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  Termos e Condicoes
                </Link>{" "}
                para informacoes adicionais.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
