/**
 * Nosso time — cada profissional é um card do baralho e troca a copy da seção.
 *
 * Fotos: coloque o arquivo em /public/team/ e preencha `photo`
 * (ex.: '/team/design.jpg', retrato vertical 2:3). Sem foto, o card mostra a
 * ilustração da função. `name` é opcional: quando preenchido vira o título do
 * card e a função desce para a linha de baixo.
 *
 * `headline`: trechos com `mark: true` recebem o marca-texto ciano.
 * `interest`: pré-seleciona o interesse no formulário de contato.
 */
export const team = [
  {
    key: 'design',
    tab: 'Design',
    role: 'Designer e Planejamento',
    specialty: 'Identidade, UX/UI e estratégia',
    name: '',
    photo: '',
    headline: [{ text: 'Design que' }, { text: 'conduz à decisão.', mark: true }],
    description:
      'Antes de desenhar, planejamos. Hierarquia, narrativa e identidade trabalham juntas para que o seu cliente entenda a oferta, confie na marca e avance para o contato.',
    note: 'Identidade visual, UX/UI e planejamento estratégico.',
    interest: 'Designer'
  },
  {
    key: 'software',
    tab: 'Software',
    role: 'Engenheiro de Software',
    specialty: 'Sites, sistemas e automações',
    name: '',
    photo: '',
    headline: [{ text: 'Código que' }, { text: 'sustenta o crescimento.', mark: true }],
    description:
      'Plataformas, integrações e automações construídas com código limpo, performance e segurança — uma base sólida para a sua operação escalar sem retrabalho.',
    note: 'Sites, SaaS, integrações e automações sob medida.',
    interest: 'Software Development'
  },
  {
    key: 'traffic',
    tab: 'Tráfego',
    role: 'Gestor de Tráfego',
    specialty: 'Meta Ads, Google Ads e dados',
    name: '',
    photo: '',
    headline: [{ text: 'Anúncios que' }, { text: 'viram clientes.', mark: true }],
    description:
      'Campanhas planejadas para atrair o público certo e levá-lo direto à sua página — com dados, testes contínuos e foco no retorno de cada real investido.',
    note: 'Meta Ads, Google Ads e análise de resultados.',
    interest: 'Gestão de Tráfego'
  }
];
