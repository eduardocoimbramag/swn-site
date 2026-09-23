/**
 * Categorias de cases — alimentam o carrossel da landing, o índice /cases e
 * a galeria de cada categoria (/cases/:slug).
 *
 * Schema:
 *   slug          → URL legível, /cases/:slug (também referenciado em cases.js)
 *   name          → nome de exibição ("SaaS")
 *   tag           → pílula sobre a imagem do card ("Software · Cloud")
 *   tagline       → frase curta em destaque (branco) nos cards do índice /cases
 *   description   → o que é a categoria, em texto de apoio (cinza) nos cards
 *   mockup        → ilustração SVG ('dashboard' | 'site' | 'landing' | 'store' |
 *                   'crm' | 'chat' | 'social' | 'ads' | 'erp')
 *   accent        → gradient CSS aplicado ao fundo da imagem
 */

export const caseCategories = [
  {
    slug: 'saas',
    name: 'SaaS',
    tag: 'Software · Cloud',
    tagline: 'Software como serviço.',
    description:
      'Software que roda na nuvem e é acessado pelo navegador, por assinatura — sem instalação, com atualizações contínuas e escala sob demanda.',
    mockup: 'dashboard',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.22), rgba(131, 223, 233, 0.04))'
  },

  {
    slug: 'site-institucional',
    name: 'Site institucional',
    tag: 'Web · Marca',
    tagline: 'A sede digital da sua marca.',
    description:
      'O endereço oficial da empresa na internet: apresenta história, serviços e diferenciais, transmite credibilidade e é encontrado no Google.',
    mockup: 'site',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.16), rgba(131, 223, 233, 0.02))'
  },

  {
    slug: 'landing-page',
    name: 'Landing page',
    tag: 'Web · Conversão',
    tagline: 'Uma página, um objetivo.',
    description:
      'Página única criada para uma ação específica — captar contatos, vender um produto ou divulgar um lançamento — com foco total em conversão.',
    mockup: 'landing',
    accent:
      'linear-gradient(160deg, rgba(131, 223, 233, 0.20), rgba(131, 223, 233, 0.03))'
  },

  {
    slug: 'e-commerce',
    name: 'E-commerce',
    tag: 'Web · Loja virtual',
    tagline: 'Sua loja aberta 24 horas.',
    description:
      'Loja virtual para vender pela internet: catálogo, carrinho, pagamentos e frete integrados, com pedidos e estoque geridos em um só painel.',
    mockup: 'store',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.20), rgba(131, 223, 233, 0.04))'
  },

  {
    slug: 'crm',
    name: 'CRM',
    tag: 'Software · Vendas',
    tagline: 'Gestão do relacionamento com o cliente.',
    description:
      'Sistema que centraliza contatos, negociações e histórico de cada cliente, organizando o funil de vendas para nenhuma oportunidade se perder.',
    mockup: 'crm',
    accent:
      'linear-gradient(150deg, rgba(131, 223, 233, 0.18), rgba(131, 223, 233, 0.03))'
  },

  {
    slug: 'chatbot',
    name: 'Chatbot',
    tag: 'Automação · IA',
    tagline: 'Atendimento que não dorme.',
    description:
      'Assistente virtual que conversa com seus clientes no WhatsApp, no site e nas redes: tira dúvidas, qualifica contatos e agenda atendimentos 24/7.',
    mockup: 'chat',
    accent:
      'linear-gradient(180deg, rgba(131, 223, 233, 0.18), rgba(0, 0, 0, 0.4))'
  },

  {
    slug: 'social-media',
    name: 'Social Media',
    tag: 'Marketing · Conteúdo',
    tagline: 'Presença que constrói marca.',
    description:
      'Gestão estratégica das redes sociais: planejamento, criação de conteúdo e análise de resultados para construir autoridade e engajar o público.',
    mockup: 'social',
    accent:
      'linear-gradient(180deg, rgba(131, 223, 233, 0.16), rgba(0, 0, 0, 0.35))'
  },

  {
    slug: 'trafego-pago',
    name: 'Tráfego pago',
    tag: 'Marketing · Performance',
    tagline: 'Anúncios que geram demanda.',
    description:
      'Anúncios no Google, Instagram e outras plataformas para atrair o público certo, com campanhas otimizadas continuamente e retorno mensurável.',
    mockup: 'ads',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.22), rgba(131, 223, 233, 0.04))'
  },

  {
    slug: 'sistema-de-gestao',
    name: 'Sistema de gestão',
    tag: 'Software · Operação',
    tagline: 'Sua operação em um só lugar.',
    description:
      'Software sob medida que integra os processos internos — financeiro, estoque, vendas e equipe — com indicadores em tempo real para decidir melhor.',
    mockup: 'erp',
    accent:
      'linear-gradient(160deg, rgba(131, 223, 233, 0.18), rgba(131, 223, 233, 0.03))'
  }
];

/* Helpers */

export const getCategoryBySlug = (slug) =>
  caseCategories.find((c) => c.slug === slug);

export const getCategoryPath = (slug) => `/cases/${slug}`;
