export interface PostStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
  prompt: string;
}

export const POST_STYLES: PostStyle[] = [
  {
    id: 'engaging',
    name: 'Engajamento Alto',
    emoji: '🔥',
    description: 'Cria posts que geram curtidas, comentários e compartilhamentos',
    prompt: `Crie uma legenda EXTREMAMENTE envolvente e viral para Instagram/Facebook que:
- Use storytelling para capturar atenção nos primeiros 3 segundos
- Faça uma pergunta provocativa que estimule comentários
- Inclua call-to-action forte e criativo
- Use 3-5 hashtags estratégicas e relevantes
- Adicione emojis de forma natural (não exagere)
- Tom: amigável, autêntico e conversacional
- Máximo 150 palavras`
  },
  {
    id: 'educational',
    name: 'Educacional',
    emoji: '📚',
    description: 'Compartilha conhecimento e agrega valor ao público',
    prompt: `Crie uma legenda educacional e informativa que:
- Apresente um fato ou dica valiosa de forma clara
- Use estrutura de lista ou passo a passo quando possível
- Forneça informação prática e aplicável
- Estabeleça autoridade no assunto
- Inclua hashtags educacionais
- Tom: profissional mas acessível
- Máximo 200 palavras`
  },
  {
    id: 'inspirational',
    name: 'Inspiracional',
    emoji: '✨',
    description: 'Motiva e inspira a audiência com mensagens positivas',
    prompt: `Crie uma legenda inspiracional e motivadora que:
- Conte uma história de superação ou transformação
- Transmita emoção genuína e autenticidade
- Inclua uma lição ou reflexão poderosa
- Encoraje a ação positiva
- Use linguagem poética mas não piegas
- Tom: otimista e empoderador
- Máximo 180 palavras`
  },
  {
    id: 'promotional',
    name: 'Promocional',
    emoji: '🎯',
    description: 'Vende produtos/serviços de forma persuasiva',
    prompt: `Crie uma copy de vendas persuasiva que:
- Destaque benefícios (não apenas características)
- Crie senso de urgência ou escassez
- Use prova social ou depoimento implícito
- Inclua CTA claro e direto para ação
- Aborde objeções comuns
- Tom: entusiasmado mas não insistente
- Máximo 150 palavras`
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    emoji: '📖',
    description: 'Conta uma história envolvente e memorável',
    prompt: `Crie uma narrativa cativante que:
- Siga estrutura: gancho > desenvolvimento > reviravolta/lição
- Use detalhes sensoriais e emocionais
- Crie conexão através da vulnerabilidade
- Termine com mensagem impactante
- Mantenha ritmo dinâmico e envolvente
- Tom: pessoal e íntimo
- Máximo 250 palavras`
  },
  {
    id: 'humorous',
    name: 'Humorístico',
    emoji: '😂',
    description: 'Diverte e cria conexão através do humor',
    prompt: `Crie uma legenda divertida e leve que:
- Use humor inteligente e atual (sem ofensas)
- Faça referências culturais relevantes
- Crie situações relacionáveis e engraçadas
- Inclua timing cômico nos emojis
- Mantenha leveza e espontaneidade
- Tom: descontraído e bem-humorado
- Máximo 120 palavras`
  },
  {
    id: 'question',
    name: 'Interativo (Pergunta)',
    emoji: '❓',
    description: 'Estimula interação através de perguntas estratégicas',
    prompt: `Crie uma legenda interativa que:
- Faça uma pergunta provocativa ou curiosa
- Apresente cenário que exija opinião
- Dê exemplos de respostas possíveis
- Crie debate saudável e engajamento
- Incentive marcação de amigos
- Tom: curioso e inclusivo
- Máximo 100 palavras`
  },
  {
    id: 'authentic',
    name: 'Autêntico/Pessoal',
    emoji: '💭',
    description: 'Compartilha momentos genuínos e vulneráveis',
    prompt: `Crie uma legenda autêntica e pessoal que:
- Compartilhe reflexão ou momento real
- Seja vulnerável sem ser dramático
- Crie identificação imediata
- Mostre o lado humano
- Convide a comunidade a compartilhar também
- Tom: honesto e genuíno
- Máximo 160 palavras`
  }
];

export const HASHTAG_STRATEGIES = {
  'high-reach': {
    name: 'Alto Alcance',
    description: 'Hashtags populares para máximo alcance',
    ranges: ['1M-5M', '500K-1M']
  },
  'niche-targeted': {
    name: 'Nicho Específico',
    description: 'Hashtags de nicho para público qualificado',
    ranges: ['50K-500K', '10K-50K']
  },
  'mixed': {
    name: 'Estratégia Mista',
    description: 'Combina alcance e especificidade',
    ranges: ['1M+', '100K-1M', '10K-100K']
  }
};

export interface CopyEnhancement {
  type: 'hook' | 'cta' | 'hashtag' | 'emoji' | 'format';
  title: string;
  suggestion: string;
}

export function analyzeCaption(caption: string): CopyEnhancement[] {
  const enhancements: CopyEnhancement[] = [];

  // Análise de gancho inicial
  const firstLine = caption.split('\n')[0];
  if (firstLine.length < 30) {
    enhancements.push({
      type: 'hook',
      title: 'Gancho Inicial',
      suggestion: 'Primeira linha muito curta. Expanda para criar mais impacto nos primeiros 3 segundos.'
    });
  }

  // Análise de CTA
  const hasQuestion = /\?/.test(caption);
  const hasCTA = /(clique|comente|marque|compartilhe|saiba mais|link|bio)/i.test(caption);
  if (!hasQuestion && !hasCTA) {
    enhancements.push({
      type: 'cta',
      title: 'Call-to-Action',
      suggestion: 'Adicione uma pergunta ou CTA para aumentar engajamento (ex: "E você, o que acha?")'
    });
  }

  // Análise de hashtags
  const hashtagCount = (caption.match(/#\w+/g) || []).length;
  if (hashtagCount === 0) {
    enhancements.push({
      type: 'hashtag',
      title: 'Hashtags Ausentes',
      suggestion: 'Adicione 5-10 hashtags relevantes para aumentar o alcance do post'
    });
  } else if (hashtagCount > 15) {
    enhancements.push({
      type: 'hashtag',
      title: 'Excesso de Hashtags',
      suggestion: 'Reduza para 8-12 hashtags. Qualidade > quantidade'
    });
  }

  // Análise de emojis
  const emojiCount = (caption.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length;
  if (emojiCount === 0) {
    enhancements.push({
      type: 'emoji',
      title: 'Adicione Emojis',
      suggestion: 'Inclua 2-5 emojis para tornar o texto mais visual e atraente'
    });
  }

  // Análise de formatação
  const hasBreakLines = caption.includes('\n\n');
  if (!hasBreakLines && caption.length > 200) {
    enhancements.push({
      type: 'format',
      title: 'Formatação',
      suggestion: 'Use quebras de linha e espaçamento para facilitar a leitura'
    });
  }

  return enhancements;
}

export function generateHashtags(topic: string, strategy: string = 'mixed'): string[] {
  // Esta é uma implementação simplificada
  // Em produção, você usaria uma API real de hashtags ou banco de dados
  const baseHashtags = [
    'instagood', 'photooftheday', 'love', 'beautiful', 'happy',
    'follow', 'like4like', 'instalike', 'picoftheday', 'fashion'
  ];

  return baseHashtags.slice(0, 8).map(tag => `#${tag}`);
}
