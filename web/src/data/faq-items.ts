export interface FaqItem {
  question: string;
  answer: string;
  category: "Encomendas" | "Envios" | "Pagamentos" | "Devoluções" | "Conta" | "Geral";
}

export const faqItems: readonly FaqItem[] = [
  // Encomendas
  {
    category: "Encomendas",
    question: "Como posso acompanhar a minha encomenda?",
    answer:
      "Após o envio, receberá um e-mail com o número de tracking e um link direto para acompanhar a encomenda em tempo real. Pode também consultar o estado na sua área de cliente, na secção 'As Minhas Encomendas'.",
  },
  {
    category: "Encomendas",
    question: "Posso alterar ou cancelar uma encomenda já efetuada?",
    answer:
      "Sim, desde que a encomenda ainda não tenha sido expedida. Contacte o nosso suporte o mais rapidamente possível via e-mail ou telefone. Se já estiver em trânsito, poderá recusar a entrega ou solicitar a devolução após receção.",
  },
  {
    category: "Encomendas",
    question: "Qual é o valor mínimo de encomenda?",
    answer:
      "Não existe valor mínimo de encomenda na VoltStock. Pode comprar qualquer produto independentemente do valor. Porém, encomendas acima de 50\u20AC beneficiam de envio gratuito para Portugal Continental.",
  },
  {
    category: "Encomendas",
    question: "Um produto está esgotado. Quando volta a estar disponível?",
    answer:
      "Na página do produto esgotado, pode ativar o alerta de reposição de stock. Assim que o artigo estiver novamente disponível, receberá uma notificação por e-mail. Também pode contactar o suporte para saber a previsão de reposição.",
  },

  // Envios
  {
    category: "Envios",
    question: "Quanto tempo demora a entrega?",
    answer:
      "Para Portugal Continental, as entregas são feitas em 1-3 dias úteis via CTT Expresso. Encomendas efetuadas até às 14h são processadas no mesmo dia. Para os Açores e Madeira, o prazo é de 3-7 dias úteis.",
  },
  {
    category: "Envios",
    question: "Qual é o custo de envio?",
    answer:
      "O envio para Portugal Continental custa 3,99\u20AC e é gratuito em encomendas acima de 50\u20AC. Para os Açores e Madeira, o custo é de 6,99\u20AC (gratuito acima de 80\u20AC). Entregas internacionais para a UE estão disponíveis com custos calculados no checkout.",
  },
  {
    category: "Envios",
    question: "Fazem entregas internacionais?",
    answer:
      "Sim, enviamos para todos os países da União Europeia. Os custos e prazos variam consoante o destino e são calculados automaticamente no checkout. Para envios fora da UE, contacte o nosso suporte para um orçamento personalizado.",
  },
  {
    category: "Envios",
    question: "Posso escolher a data e hora de entrega?",
    answer:
      "Atualmente, a seleção de data e hora específica não está disponível. Contudo, ao efetuar a encomenda pode adicionar instruções de entrega (ex: deixar na portaria, entregar ao vizinho) no campo de observações do checkout.",
  },

  // Pagamentos
  {
    category: "Pagamentos",
    question: "Quais são os métodos de pagamento aceites?",
    answer:
      "Aceitamos MBWay, Multibanco (referência bancária), cartões Visa e Mastercard, e transferência bancária. Todos os pagamentos são processados com encriptação SSL e conformidade PCI-DSS.",
  },
  {
    category: "Pagamentos",
    question: "Os pagamentos são seguros?",
    answer:
      "Absolutamente. Utilizamos encriptação SSL de 256 bits e os dados do seu cartão nunca são armazenados nos nossos servidores. Todos os pagamentos por cartão são processados via Stripe, que cumpre os mais elevados padrões de segurança PCI-DSS Level 1.",
  },
  {
    category: "Pagamentos",
    question: "Posso pedir fatura com NIF?",
    answer:
      "Sim, todas as faturas são emitidas automaticamente com o NIF que indicar no momento da compra. Pode também solicitar fatura de empresa com dados fiscais completos. As faturas são enviadas por e-mail e ficam disponíveis na sua área de cliente.",
  },
  {
    category: "Pagamentos",
    question: "Quando é cobrado o pagamento por Multibanco?",
    answer:
      "Ao escolher pagamento por Multibanco, recebe uma referência válida por 72 horas. O pagamento só é cobrado quando efetuar o pagamento num terminal ATM ou homebanking. A encomenda é processada automaticamente após confirmação do pagamento.",
  },

  // Devoluções
  {
    category: "Devoluções",
    question: "Qual é a política de devoluções?",
    answer:
      "Tem direito a devolver qualquer produto no prazo de 14 dias após a receção, sem necessidade de justificação, conforme o Decreto-Lei 24/2014 (Lei Europeia do Consumidor). Os custos de devolução são por nossa conta.",
  },
  {
    category: "Devoluções",
    question: "Como solicito uma devolução?",
    answer:
      "Aceda à sua área de cliente, selecione a encomenda e clique em 'Solicitar Devolução'. Em alternativa, envie um e-mail para suporte@voltstock.pt com o número da encomenda. Receberá uma etiqueta de devolução pré-paga no prazo de 24 horas.",
  },
  {
    category: "Devoluções",
    question: "Quando recebo o reembolso?",
    answer:
      "O reembolso é processado no prazo de 5 a 10 dias úteis após recebermos e inspecionarmos o produto devolvido. O valor é creditado no mesmo método de pagamento utilizado na compra original.",
  },
  {
    category: "Devoluções",
    question: "Posso trocar um produto em vez de devolver?",
    answer:
      "Sim, oferecemos troca direta para produtos em stock. Basta indicar o artigo pretendido ao solicitar a devolução. Se houver diferença de preço, será ajustada automaticamente. A troca é enviada assim que recebermos o produto original.",
  },

  // Conta
  {
    category: "Conta",
    question: "Como crio uma conta na VoltStock?",
    answer:
      "Clique em 'Criar Conta' no canto superior direito do site. Pode registar-se com e-mail e password ou utilizar o login social com Google. A criação de conta é gratuita e permite acompanhar encomendas, guardar favoritos e aceder a ofertas exclusivas.",
  },
  {
    category: "Conta",
    question: "Esqueci-me da password. Como a recupero?",
    answer:
      "Na página de login, clique em 'Esqueci-me da Password'. Insira o e-mail associado à sua conta e receberá um link de recuperação válido por 24 horas. Se não receber o e-mail, verifique a pasta de spam ou contacte o suporte.",
  },
  {
    category: "Conta",
    question: "Como são protegidos os meus dados pessoais?",
    answer:
      "Cumprimos integralmente o RGPD (Regulamento Geral de Proteção de Dados). Os seus dados são encriptados e nunca partilhados com terceiros para fins de marketing. Pode consultar, alterar ou eliminar os seus dados a qualquer momento na área de cliente.",
  },

  // Geral
  {
    category: "Geral",
    question: "Os produtos têm garantia?",
    answer:
      "Sim, todos os produtos têm garantia europeia mínima de 2 anos, conforme a legislação da UE. Para produtos adquiridos após 1 de janeiro de 2022, a garantia legal é de 3 anos (Lei 3/2021). Tratamos de todo o processo de garantia.",
  },
  {
    category: "Geral",
    question: "Fazem montagem personalizada de PCs?",
    answer:
      "Sim! Somos especialistas em montagem de estações de trabalho e setups gaming de alta performance. Contacte o nosso suporte técnico para um orçamento personalizado e aconselhamento gratuito.",
  },
  {
    category: "Geral",
    question: "Têm loja física?",
    answer:
      "Atualmente operamos exclusivamente online, o que nos permite oferecer preços mais competitivos. Toda a operação é gerida a partir de Portugal, com armazém próprio e suporte técnico nacional em português.",
  },
  {
    category: "Geral",
    question: "Como posso contactar o suporte?",
    answer:
      "Pode contactar-nos via e-mail (suporte@voltstock.pt), telefone ou pelo formulário de contacto no site. O nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Respondemos a todos os pedidos no prazo máximo de 24 horas.",
  },
] as const;
