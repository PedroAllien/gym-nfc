import type { Treino } from '@/types/treino';
import type { Exercicio } from '@/types/exercicio';

export function formatTreinoContext(treino: Treino): string {
  let context = `Treino: ${treino.nome}\n`;
  
  if (treino.descricao) {
    context += `Descrição: ${treino.descricao}\n`;
  }
  
  context += `\nExercícios do Treino:\n`;
  
  treino.exercicios.forEach((te, index) => {
    context += `\n${index + 1}. ${te.exercicio.nome}`;
    
    if (te.exercicio.categoria) {
      context += ` (Categoria: ${te.exercicio.categoria.nome})`;
    }
    
    if (te.exercicio.descricao) {
      context += `\n   Descrição: ${te.exercicio.descricao}`;
    }
    
    if (te.series) {
      context += `\n   Séries: ${te.series}`;
    }
    
    if (te.repeticoes) {
      context += `\n   Repetições: ${te.repeticoes}`;
    }
    
    if (te.descanso) {
      context += `\n   Descanso: ${te.descanso}`;
    }
    
    if (te.observacao) {
      context += `\n   Observação: ${te.observacao}`;
    }
  });
  
  return context;
}

export function formatExercicioContext(exercicio: Exercicio): string {
  let context = `Exercício: ${exercicio.nome}\n`;
  
  if (exercicio.categoria) {
    context += `Categoria: ${exercicio.categoria.nome}\n`;
  }
  
  if (exercicio.descricao) {
    context += `Descrição: ${exercicio.descricao}\n`;
  }
  
  if (exercicio.youtubeId) {
    context += `Vídeo de demonstração disponível (ID: ${exercicio.youtubeId})\n`;
  }
  
  return context;
}
