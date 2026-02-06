import { NextRequest, NextResponse } from 'next/server';

const AI_TEMPLATES = {
  engaging: (context: string) => `Você é um copywriter expert em redes sociais. Crie uma legenda VIRAL para Instagram/Facebook seguindo estas diretrizes:

CONTEXTO: ${context || 'Post de rede social'}

ESTRUTURA:
1. GANCHO (primeiras 2-3 palavras) - deve parar o scroll
2. DESENVOLVIMENTO - conte uma micro-história ou compartilhe valor
3. CTA/PERGUNTA - estimule ação ou comentário

REQUISITOS:
- Tom conversacional e autêntico
- Inclua 1 pergunta provocativa
- Use 3-5 emojis estratégicos
- Adicione 5-8 hashtags relevantes
- Máximo 150 palavras
- Crie senso de comunidade

EVITE:
- Linguagem formal ou corporativa
- Excesso de pontuação (!!! ...)
- Hashtags irrelevantes

Gere APENAS a legenda, sem explicações.`,

  educational: (context: string) => `Você é um educador digital especializado em microlearning. Crie um post educacional valioso:

TEMA: ${context || 'Compartilhar conhecimento'}

FORMATO:
📚 TÍTULO ATRATIVO
[2-3 linhas introdutórias]

✨ DICA/INFORMAÇÃO PRINCIPAL
[Explique de forma clara e prática]

💡 APLICAÇÃO
[Como usar isso hoje]

#️⃣ [5-7 hashtags educacionais]

DIRETRIZES:
- Linguagem simples e acessível
- Informação verificável e útil
- Inclua exemplo prático
- Máximo 200 palavras

Gere APENAS o conteúdo.`,

  promotional: (context: string) => `Você é um copywriter de vendas especializado em marketing digital. Crie uma copy persuasiva:

PRODUTO/SERVIÇO: ${context || 'Oferta especial'}

ESTRUTURA DE VENDAS:
🎯 GANCHO - problema/desejo
❌ DOR - agrave o problema
✅ SOLUÇÃO - seu produto
🎁 BENEFÍCIO - transformação
⏰ URGÊNCIA - motivo para agir AGORA
👉 CTA - ação específica

TÉCNICAS:
- Use gatilhos mentais (escassez, prova social, autoridade)
- Foque em benefícios, não características
- Crie FOMO (fear of missing out)
- CTA direto e irresistível

Máximo 150 palavras. Gere APENAS a copy.`,

  inspirational: (context: string) => `Você é um criador de conteúdo inspiracional. Crie uma mensagem motivadora:

TEMA: ${context || 'Inspiração e motivação'}

ELEMENTOS:
✨ Abridor emocional
📖 Mini-história de superação/transformação
💪 Lição ou insight profundo
🌟 Encerramento empoderador
🙏 Convite à reflexão

ESTILO:
- Autêntico e vulnerável
- Linguagem poética mas acessível
- Transmita esperança e possibilidade
- Use metáforas visuais

Máximo 180 palavras.`,

  storytelling: (context: string) => `Você é um contador de histórias digital. Crie uma narrativa envolvente:

CONTEXTO: ${context || 'História pessoal'}

ESTRUTURA NARRATIVA:
🎬 ABERTURA - gancho visual/emocional
📍 SITUAÇÃO - estabeleça o cenário
⚡ CONFLITO/DESAFIO - crie tensão
🔄 REVIRAVOLTA - momento "aha"
💎 LIÇÃO/MENSAGEM - takeaway valioso
❤️ FECHAMENTO - conexão emocional

TÉCNICAS:
- Detalhes sensoriais (cores, sons, sensações)
- Diálogo quando apropriado
- Mostre, não apenas conte
- Ritmo dinâmico

Máximo 250 palavras.`,

  humorous: (context: string) => `Você é um criador de conteúdo humorístico brasileiro. Crie um post divertido:

TEMA: ${context || 'Situação do dia a dia'}

ESTILO:
- Humor inteligente e inclusivo
- Referências culturais atuais (memes, séries, trends)
- Situações relacionáveis
- Auto-ironia quando apropriado

FORMATO:
😂 Setup - situação engraçada
🎭 Punchline - reviravolta cômica
😅 Conclusão - relatable

EMOJIS: Use com timing cômico
HASHTAGS: 3-5, divertidas

Máximo 120 palavras. SEM piadas ofensivas.`,

  question: (context: string) => `Você é um community manager especializado em engajamento. Crie um post interativo:

TEMA: ${context || 'Pergunta para comunidade'}

FORMATO:
❓ PERGUNTA PRINCIPAL - instigante e clara
💭 CONTEXTO - 2-3 linhas explicativas
📊 OPÇÕES - sugira 2-4 respostas possíveis
👥 INCENTIVO - motive marcação de amigos

TIPOS DE PERGUNTA:
- "Você prefere X ou Y?"
- "Qual foi seu momento...?"
- "Se você pudesse... o que faria?"
- "Verdade ou mito: ..."

Máximo 100 palavras. Foco em gerar COMENTÁRIOS.`,

  authentic: (context: string) => `Você é um criador de conteúdo autêntico. Crie um post genuíno e pessoal:

TEMA: ${context || 'Reflexão pessoal'}

ABORDAGEM:
💭 Vulnerabilidade - compartilhe algo real
🪞 Reflexão - o que aprendeu
🤝 Conexão - convide identificação
💬 Abertura - incentive compartilhamento

TOM:
- Honesto sem ser dramático
- Pessoal mas não egocêntrico
- Imperfeito e humano
- Conversacional

Máximo 160 palavras. Seja VOCÊ.`
};

// Simulação de IA (em produção, use OpenAI, Claude, etc.)
function generateAICaption(style: string, context: string): string {
  const templates: Record<string, () => string> = {
    engaging: () => {
      const hooks = ['Você não vai acreditar...', 'Pausa tudo que você está fazendo 🚨', 'Isso mudou tudo para mim:', 'Se você ainda não sabe disso...'];
      const hook = hooks[Math.floor(Math.random() * hooks.length)];
      
      return `${hook}

${context || 'Hoje quero compartilhar algo importante com vocês'} e isso pode fazer toda a diferença no seu dia! 

Sabe aquele momento em que você percebe que estava fazendo tudo errado? Pois é... 😅

Conta nos comentários: VOCÊ JÁ PASSOU POR ISSO? 👇

Marca aquele amigo que PRECISA ver isso! ❤️

#dicasincriveis #transformacao #motivacao #inspiraçao #crescimento #comunidade #autoconhecimento #vidasaudavel`;
    },
    
    educational: () => {
      return `📚 VOCÊ SABIA DISSO?

${context || 'Muita gente não sabe, mas esse conhecimento pode fazer toda diferença'}! 

💡 DICA VALIOSA:
Quando você aplica esse conceito na prática, os resultados aparecem muito mais rápido. A chave está em entender o processo e agir com consistência.

✅ COMO APLICAR HOJE:
1. Identifique o ponto de partida
2. Defina metas claras
3. Tome ação consistente
4. Ajuste conforme necessário

Salva esse post para consultar sempre! 🔖

Alguma dúvida? Pergunta nos comentários! 💬

#educacao #aprendizado #conhecimento #dicas #crescimentopessoal #desenvolvimentopessoal #estudos`;
    },

    promotional: () => {
      return `🎯 ${context || 'OPORTUNIDADE INCRÍVEL'} 

❌ Cansado de tentar sem ver resultados?
❌ Quer uma solução que realmente funcione?

✅ A resposta está aqui! 

🎁 COM ESSA SOLUÇÃO VOCÊ VAI:
→ Ver resultados reais em poucos dias
→ Economizar tempo e dinheiro
→ Ter suporte completo
→ Garantia de satisfação

⏰ ATENÇÃO: Últimas vagas disponíveis!

👉 CLICA NO LINK DA BIO para garantir o seu! 

Não deixe essa oportunidade passar! 🚀

#oferta #promocao #oportunidade #compraagora #limitado #desconto #imperdivel`;
    },

    inspirational: () => {
      return `✨ Às vezes, o que você precisa ouvir é:

Você é mais forte do que imagina. 💪

${context || 'Cada desafio que você enfrenta está te preparando para algo maior'}. As dificuldades de hoje são as histórias de superação de amanhã.

Não compare seu capítulo 1 com o capítulo 20 de outra pessoa. Cada um tem seu próprio tempo e sua própria jornada.

🌟 Lembre-se: 
Progresso não é perfeição. É movimento. É persistência. É levantar mais uma vez do que você cai.

Você PODE. Você VAI. Você MERECE.

Salva esse post para ler nos dias difíceis. ❤️

#motivacao #inspiracao #crescimento #mindset #transformacao #autoestima #superacao #acredite`;
    },

    storytelling: () => {
      return `📖 Uma história que preciso compartilhar...

Lembro como se fosse ontem: ${context || 'tudo parecia impossível'}.

Eu estava no ponto mais baixo, questionando tudo. Mas sabe o que aconteceu? Uma pequena decisão mudou TUDO.

Não foi fácil. Teve noites sem dormir, teve dúvidas, teve medo. Mas também teve aprendizado, crescimento e, principalmente, transformação.

🔄 A grande virada? Percebi que eu não precisava ser perfeito. Só precisava começar.

💎 Hoje, olhando para trás, vejo que cada obstáculo foi um degrau. Cada "não" me aproximou do "sim" certo.

E se você está passando por algo parecido agora, saiba: VAI PASSAR. E vai te fazer mais forte.

Qual foi a maior lição que uma dificuldade te ensinou? 💭

#historia #superacao #transformacao #mindset #crescimento #jornada #motivacao #real`;
    },

    humorous: () => {
      return `😂 Gente, OLHA ISSO...

${context || 'Eu tentando manter a rotina'}: 📋✅
A realidade: 🎪🤡

Toda segunda eu acordo tipo: "HOJE VAI SER DIFERENTE!"
Terça-feira eu já: "ano que vem eu começo direito" 😅

Quem mais é assim? 🙋‍♀️

Plot twist: a gente nunca aprende, mas continuamos tentando! E é isso que importa (ou não né, mas vamos fingir que sim kkkk)

Tag aquele amigo que vive nesse ciclo! 😂

#humor #meme #vidaadulta #realidade #engraçado #relatavel #segunda #mood`;
    },

    question: () => {
      return `❓ PERGUNTA DO DIA:

${context || 'Se você pudesse mudar uma coisa na sua rotina, o que seria?'}

Opções:
A) ⏰ Dormir mais
B) 🏋️ Mais tempo pra exercícios  
C) 📚 Estudar/aprender algo novo
D) 💆 Mais autocuidado

Responde com A, B, C ou D nos comentários! 👇

E MARCA aquele amigo que precisa ver essa reflexão! 💭

Curiosa(o) pra ver o resultado! Será que todo mundo pensa igual? 🤔

#pergunta #comunidade #reflexao #rotina #autocuidado #saude #equilibrio`;
    },

    authentic: () => {
      return `💭 Vulnerabilidade em 3... 2... 1...

${context || 'Hoje acordei pensando sobre como a gente cobra perfeição de nós mesmos'}.

Sabe aquele post que você vê e pensa "nossa, que vida perfeita"? Pois é. Por trás tem muito mais do que aparece.

Eu não tenho tudo resolvido. Longe disso. Tem dias que dá tudo certo e tem dias que... bom, acontece. 😅

Mas sabe o que percebi? Tá tudo bem não estar bem o tempo todo. Tá tudo bem errar. Tá tudo bem ser humano.

A gente não precisa ser extraordinário todos os dias. Às vezes só precisamos estar aqui, fazendo o melhor que podemos HOJE.

E se você tá se sentindo assim também, saiba que não está sozinho(a). ❤️

Desabafa aqui embaixo. Vamos criar um espaço seguro juntos? 🤗

#autenticidade #vulnerabilidade #real #humanidade #mental #autocuidado #saude`;
    }
  };

  const generator = templates[style] || templates.engaging;
  return generator();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, style, context, caption, enhancement } = body;

    if (action === 'improve') {
      // Melhorar legenda existente com base na sugestão
      let improvedCaption = caption;

      if (enhancement.type === 'hook') {
        const hooks = ['PARA TUDO! ', 'Você PRECISA ver isso: ', 'Atenção! 🚨 '];
        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        improvedCaption = hook + caption;
      } else if (enhancement.type === 'cta') {
        improvedCaption += '\n\nE você, o que acha? Conta nos comentários! 👇';
      } else if (enhancement.type === 'hashtag') {
        const hashtags = '\n\n#inspire #motivacao #transformacao #crescimento #sucesso #dicas #conhecimento #comunidade';
        improvedCaption += hashtags;
      } else if (enhancement.type === 'emoji') {
        // Adiciona emojis relevantes
        improvedCaption = improvedCaption.replace(/\./g, '. ✨');
      } else if (enhancement.type === 'format') {
        // Adiciona quebras de linha
        const sentences = improvedCaption.split('. ');
        improvedCaption = sentences.join('.\n\n');
      }

      return NextResponse.json({ caption: improvedCaption });
    }

    // Gerar nova legenda
    const generatedCaption = generateAICaption(style, context);
    
    return NextResponse.json({ 
      caption: generatedCaption,
      style: style,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro na geração de copy:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar copy com IA: ' + error.message },
      { status: 500 }
    );
  }
}
