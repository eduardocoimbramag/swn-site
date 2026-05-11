/**
 * Cases — fonte única para o carrossel da landing E para as páginas individuais.
 *
 * Schema:
 *   id          → identificador curto, usado em keys
 *   slug        → URL legível, /cases/:slug
 *   client      → nome do cliente (display)
 *   sector      → segmento de mercado
 *   year        → ano do projeto
 *   duration    → duração total
 *   teamSize    → tamanho do time SWN no projeto
 *
 *   tag         → categoria curta para o card do carrossel ("SaaS · Software")
 *   boldLead    → primeira frase em bold do card ("Plataforma de gestão.")
 *   cardText    → restante do texto do card (~120 chars)
 *   mockup      → kind do mockup ('dashboard' | 'mobile' | 'site')
 *   accent      → gradient CSS aplicado no card (e na imagem hero da página)
 *
 *   metrics[]   → array de até 3 métricas { value, label }
 *
 *   headline    → título principal da página individual
 *   subhead     → subtítulo (2-3 linhas vendendo o resultado)
 *
 *   challenge   → bloco "O desafio" { title, text }
 *   solution    → bloco "A solução" { title, text, features[] }
 *   result      → bloco "O resultado" { title, text }
 *
 *   stack[]         → tecnologias usadas
 *   integrations[]  → integrações externas
 *
 *   testimonial → quote específica do case (opcional)
 *   liveUrl     → URL pública do projeto (opcional)
 */

export const cases = [
  {
    id: 'vexa-group',
    slug: 'vexa-group-plataforma-gestao',
    client: 'Vexa Group',
    sector: 'Logística B2B',
    year: 2024,
    duration: '4 meses',
    teamSize: 3,

    tag: 'SaaS · Software',
    boldLead: 'Plataforma de gestão.',
    cardText:
      'SaaS multitenant que automatizou fluxos operacionais e reduziu o tempo de resposta interna em mais de um terço.',
    mockup: 'dashboard',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.22), rgba(131, 223, 233, 0.04))',

    metrics: [
      { value: '−38%', label: 'tempo operacional' },
      { value: '2.5x', label: 'produtividade' },
      { value: '14k', label: 'usuários ativos' }
    ],

    headline: 'Plataforma SaaS multitenant para logística B2B.',
    subhead:
      'Reescrevemos o sistema interno em 4 meses, automatizando processos que consumiam o time inteiro.',

    challenge: {
      title: 'O desafio',
      text:
        'A Vexa cresceu 4x em dois anos, mas o sistema interno não acompanhou. Equipe operacional gastava horas em tarefas repetitivas, ferramentas isoladas geravam erro de digitação e o time não tinha visibilidade do que acontecia em tempo real. Cada nova cliente exigia uma cópia manual da configuração, com retrabalho e inconsistência.'
    },
    solution: {
      title: 'A solução',
      text:
        'Reescrevemos a plataforma como SaaS multitenant em Next.js + tRPC, com isolamento por cliente e dashboard único para toda a operação. Cada fluxo crítico foi mapeado e automatizado, com auditoria completa e permissões granulares.',
      features: [
        'Multitenant com isolamento por cliente',
        'Real-time updates via WebSocket',
        'Auditoria completa de operações',
        'Permissões granulares por equipe',
        'Onboarding automatizado de novas contas'
      ]
    },
    result: {
      title: 'O resultado',
      text:
        'O time operacional reduziu o tempo de resposta em 38%. A produtividade média subiu 2.5x. Hoje a plataforma atende 14 mil usuários ativos e a Vexa abriu uma nova vertical de produto sem aumentar o headcount técnico.'
    },

    stack: ['Next.js', 'TypeScript', 'tRPC', 'Postgres', 'Prisma', 'Vercel'],
    integrations: ['Stripe', 'Twilio', 'AWS S3'],

    testimonial: {
      text:
        'Saímos do improviso. O sistema construído pela SWN automatizou processos que consumiam o nosso time inteiro.',
      author: 'Rafael Lima',
      role: 'COO',
      avatar: 'RL'
    },

    liveUrl: null
  },

  {
    id: 'casa-plena',
    slug: 'casa-plena-app-fidelidade',
    client: 'Casa Plena',
    sector: 'Varejo · Fidelidade',
    year: 2024,
    duration: '3 meses',
    teamSize: 2,

    tag: 'Mobile · App nativo',
    boldLead: 'App de fidelidade.',
    cardText:
      'Aplicativo nativo iOS/Android com push, analytics em tempo real e integração total ao backend do cliente.',
    mockup: 'mobile',
    accent:
      'linear-gradient(180deg, rgba(131, 223, 233, 0.18), rgba(0, 0, 0, 0.4))',

    metrics: [
      { value: '12k', label: 'downloads em 90 dias' },
      { value: '4.8★', label: 'média nas lojas' },
      { value: '63%', label: 'recompra ativada' }
    ],

    headline: 'App de fidelidade nativo iOS e Android.',
    subhead:
      'Programa de pontos digital com analytics em tempo real e jornada de recompra automatizada.',

    challenge: {
      title: 'O desafio',
      text:
        'A Casa Plena tinha um programa de fidelidade em cartão físico que perdia 40% dos clientes na segunda compra. Sem dados sobre comportamento, era impossível segmentar campanhas. A operação dependia de planilhas e o resgate exigia atendimento humano em cada ponto de venda.'
    },
    solution: {
      title: 'A solução',
      text:
        'App nativo iOS/Android com programa de pontos digital, push notifications segmentadas e dashboard de analytics para o cliente. Cada interação alimenta uma visão 360 do consumidor.',
      features: [
        'Programa de pontos com regras configuráveis',
        'Push notifications segmentadas',
        'Wallet integrado (Apple/Google Pay)',
        'Dashboard analytics em tempo real',
        'Resgate self-service sem fricção'
      ]
    },
    result: {
      title: 'O resultado',
      text:
        '12 mil downloads em 90 dias, 4.8 estrelas de média nas lojas, e 63% dos clientes ativaram uma segunda compra dentro do primeiro mês. A Casa Plena descontinuou o cartão físico em 6 meses.'
    },

    stack: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
    integrations: ['Apple Wallet', 'Google Pay', 'Mixpanel'],

    testimonial: {
      text:
        'Profissionais raros. Entrega de agência grande, com o cuidado de uma boutique. Recomendo sem ressalva.',
      author: 'Helena Duarte',
      role: 'Founder',
      avatar: 'HD'
    },

    liveUrl: null
  },

  {
    id: 'atelier-nordi',
    slug: 'atelier-nordi-site-institucional',
    client: 'Atelier Nordi',
    sector: 'Moda · B2B',
    year: 2024,
    duration: '6 semanas',
    teamSize: 2,

    tag: 'Web · Institucional',
    boldLead: 'Site institucional premium.',
    cardText:
      'Reposicionamento digital com narrativa de marca, motion design e foco em captação qualificada de leads B2B.',
    mockup: 'site',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.16), rgba(131, 223, 233, 0.02))',

    metrics: [
      { value: '+72%', label: 'leads qualificados' },
      { value: '0.8s', label: 'LCP médio' },
      { value: '94', label: 'Lighthouse score' }
    ],

    headline: 'Reposicionamento digital de marca premium.',
    subhead:
      'Site institucional com narrativa de marca, motion design e arquitetura focada em conversão B2B.',

    challenge: {
      title: 'O desafio',
      text:
        'A Atelier Nordi vendia para clientes premium no atendimento presencial, mas o site não comunicava isso. Lojistas chegavam esperando uma marca corriqueira e fechavam pedidos abaixo do potencial. A taxa de qualificação dos leads era baixa e o time comercial gastava tempo educando.'
    },
    solution: {
      title: 'A solução',
      text:
        'Recriamos a presença digital alinhada ao posicionamento premium real. Narrativa cuidadosa, motion design sutil, casos de uso, e arquitetura que filtra interesse desde o primeiro scroll.',
      features: [
        'Narrativa de marca em scroll-driven storytelling',
        'Motion design coreografado',
        'Páginas de coleção com lookbook integrado',
        'Formulário B2B com qualificação automática',
        'SEO técnico (Core Web Vitals otimizado)'
      ]
    },
    result: {
      title: 'O resultado',
      text:
        'Leads qualificados subiram 72%. LCP médio em 0.8s, score Lighthouse 94. O time comercial passou a fechar pedidos no preço-alvo desde a primeira reunião.'
    },

    stack: ['React', 'Vite', 'Framer Motion', 'TypeScript'],
    integrations: ['HubSpot', 'Google Analytics', 'Vercel'],

    testimonial: {
      text:
        'A SWN traduziu nossa marca em uma experiência digital que finalmente representa quem somos.',
      author: 'Marina Costa',
      role: 'CEO',
      avatar: 'MC'
    },

    liveUrl: null
  },

  {
    id: 'studio-marche',
    slug: 'studio-marche-loja-virtual',
    client: 'Studio Marche',
    sector: 'E-commerce · Beleza',
    year: 2024,
    duration: '5 semanas',
    teamSize: 3,

    tag: 'E-commerce · Web',
    boldLead: 'Loja virtual de alta conversão.',
    cardText:
      'Plataforma com integração de pagamentos, controle de estoque em tempo real e design premium focado em CRO.',
    mockup: 'site',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.20), rgba(131, 223, 233, 0.04))',

    metrics: [
      { value: '180', label: 'pedidos / dia' },
      { value: '3.4%', label: 'taxa de conversão' },
      { value: '−45%', label: 'abandono de carrinho' }
    ],

    headline: 'E-commerce premium focado em conversão.',
    subhead:
      'Loja virtual desenhada com base em CRO real — cada elemento da página justifica sua presença.',

    challenge: {
      title: 'O desafio',
      text:
        'A Studio Marche tinha tráfego mas conversão estagnada em 1.2%. O check-out tinha 4 etapas, abandonava 70% dos carrinhos e o time não conseguia testar nada — qualquer alteração exigia deploy técnico.'
    },
    solution: {
      title: 'A solução',
      text:
        'Migramos para Shopify Hydrogen com tema próprio, otimizamos o funil em 5 sprints de CRO e implementamos infra de A/B testing acessível ao time de marketing.',
      features: [
        'Check-out em 2 etapas com pagamento integrado',
        'Recomendação de produtos cross-sell',
        'Email recovery de carrinho automatizado',
        'A/B testing infra (sem deploy)',
        'Performance otimizada (Lighthouse 92)'
      ]
    },
    result: {
      title: 'O resultado',
      text:
        '180 pedidos por dia em regime, 3.4% de taxa de conversão e abandono de carrinho caiu 45%. O time de marketing passou a rodar testes semanais sem depender de dev.'
    },

    stack: ['Shopify', 'Hydrogen', 'Remix', 'Klaviyo'],
    integrations: ['Stripe', 'Klaviyo', 'Hotjar', 'GA4'],

    testimonial: {
      text:
        'Atenção aos detalhes que fez diferença real. Tudo soa premium, do micro-interação ao copy.',
      author: 'Sofia Reis',
      role: 'Head of Design',
      avatar: 'SR'
    },

    liveUrl: null
  },

  {
    id: 'lumen-labs',
    slug: 'lumen-labs-dashboard-bi',
    client: 'Lumen Labs',
    sector: 'SaaS · Analytics',
    year: 2025,
    duration: '5 meses',
    teamSize: 4,

    tag: 'SaaS · Analytics',
    boldLead: 'Dashboard de BI sob medida.',
    cardText:
      'Suite analítica com visualizações customizadas, exportação automatizada e permissões granulares por equipe.',
    mockup: 'dashboard',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.22), rgba(131, 223, 233, 0.04))',

    metrics: [
      { value: '4x', label: 'velocidade de decisão' },
      { value: '60+', label: 'visualizações' },
      { value: '−72%', label: 'tempo de relatório' }
    ],

    headline: 'Suite de Business Intelligence sob medida.',
    subhead:
      'Dashboard de BI com visualizações customizadas, exportação automatizada e governança granular.',

    challenge: {
      title: 'O desafio',
      text:
        'A Lumen tinha 30+ planilhas críticas pulverizadas, executivos esperando dias por relatórios manuais e sem governança de quem podia ver o quê. As decisões estratégicas se atrasavam ou eram tomadas sem dado.'
    },
    solution: {
      title: 'A solução',
      text:
        'Construímos um sistema de BI próprio, conectado a 12 fontes de dados, com visualizações customizadas por departamento, exports automatizados e permissões granulares.',
      features: [
        '60+ visualizações pré-configuradas',
        'Drag-and-drop dashboard builder',
        'Exportação automatizada (PDF/Excel/Slack)',
        'Permissões por nível e departamento',
        'Alertas inteligentes em métricas críticas'
      ]
    },
    result: {
      title: 'O resultado',
      text:
        '4x mais rápido para tomar decisões estratégicas. O tempo para gerar relatórios caiu 72%. Hoje o C-level acessa números do mês anterior em 2 cliques, sem depender do time de dados.'
    },

    stack: ['React', 'D3.js', 'GraphQL', 'TypeScript', 'BigQuery'],
    integrations: ['BigQuery', 'Snowflake', 'Slack', 'Salesforce'],

    testimonial: {
      text:
        'Resultado mensurável em poucas semanas. Marca posicionada e métricas crescendo juntas.',
      author: 'Lucas Andrade',
      role: 'CMO',
      avatar: 'LA'
    },

    liveUrl: null
  }
];

/* Helpers */

export const getCaseBySlug = (slug) =>
  cases.find((c) => c.slug === slug);

export const getNextCase = (slug) => {
  const idx = cases.findIndex((c) => c.slug === slug);
  if (idx === -1) return null;
  return cases[(idx + 1) % cases.length];
};

export const getPrevCase = (slug) => {
  const idx = cases.findIndex((c) => c.slug === slug);
  if (idx === -1) return null;
  return cases[(idx - 1 + cases.length) % cases.length];
};
