import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, context, type } = await request.json();

    if (!question || !context) {
      return NextResponse.json(
        { error: 'Pergunta e contexto são obrigatórios' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      );
    }

    const systemPrompt = type === 'treino'
      ? `Você é um personal trainer virtual especializado em treinos de academia. Sua função é ajudar durante a execução do treino.

DIRETRIZES IMPORTANTES:
- Seja DIRETO e OBJETIVO: respostas curtas (máximo 3-4 frases)
- Foque no exercício que a pessoa está executando AGORA
- Use apenas as informações fornecidas sobre o treino
- Se relevante, pode sugerir exercícios complementares (máximo 2-3)
- Pode recomendar dicas de execução, descanso ou variações relacionadas
- Mantenha o foco em academia, treino e exercícios
- Responda sempre em português brasileiro de forma amigável

Informações do Treino:
${context}

Lembre-se: respostas curtas e práticas para ajudar durante o treino!`
      : `Você é um personal trainer virtual especializado em exercícios de academia. Sua função é ajudar durante a execução do exercício.

DIRETRIZES IMPORTANTES:
- Seja DIRETO e OBJETIVO: respostas curtas (máximo 3-4 frases)
- Foque no exercício que a pessoa está executando AGORA
- Use apenas as informações fornecidas sobre o exercício
- Se relevante, pode sugerir exercícios complementares (máximo 2-3)
- Pode recomendar dicas de execução, músculos trabalhados ou variações relacionadas
- Mantenha o foco em academia, treino e exercícios
- Responda sempre em português brasileiro de forma amigável

Informações do Exercício:
${context}

Lembre-se: respostas curtas e práticas para ajudar durante a execução!`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return NextResponse.json(
        { error: 'Erro ao processar pergunta' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
