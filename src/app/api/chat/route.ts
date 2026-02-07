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
      ? `Você é um assistente especializado em treinos de academia. Responda perguntas sobre o treino fornecido de forma clara, objetiva e útil. Use apenas as informações fornecidas sobre o treino e exercícios. Se não souber algo, seja honesto.

Informações do Treino:
${context}

Responda de forma amigável e profissional, sempre em português brasileiro.`
      : `Você é um assistente especializado em exercícios de academia. Responda perguntas sobre o exercício fornecido de forma clara, objetiva e útil. Use apenas as informações fornecidas sobre o exercício. Se não souber algo, seja honesto.

Informações do Exercício:
${context}

Responda de forma amigável e profissional, sempre em português brasileiro.`;

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
        temperature: 0.7,
        max_tokens: 1000,
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
