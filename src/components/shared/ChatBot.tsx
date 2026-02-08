'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Loader2, Mic, Volume2, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseMarkdown } from '@/lib/markdown';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  context: string;
  type: 'treino' | 'exercicio';
  className?: string;
  openChat?: boolean;
  onOpenChange?: (open: boolean) => void;
  exerciciosConcluidos?: Set<string>;
}

export function ChatBot({ context, type, className, openChat, onOpenChange, exerciciosConcluidos }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (openChat !== undefined) {
      setIsOpen(openChat);
    }
  }, [openChat]);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const hasRecognition = !!SpeechRecognitionClass;
      const hasSynthesis = !!window.speechSynthesis;
      
      setHasSpeechSupport(hasRecognition && hasSynthesis);
      
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass() as SpeechRecognition;
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Erro no reconhecimento de voz:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          context,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text: string, messageId: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingMessageId(messageId);

    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      {!isOpen ? (
        <button
          onClick={() => handleToggle(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-[90vw] sm:w-[400px] h-[600px] flex flex-col">
          <div className="bg-red-600 px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">
                {type === 'treino' ? 'Dúvidas sobre o Treino' : 'Dúvidas sobre o Exercício'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-white hover:text-gray-200 transition-colors text-sm"
                  title="Limpar conversa"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={() => handleToggle(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Olá! Tenho dúvidas sobre este {type === 'treino' ? 'treino' : 'exercício'}.
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  Faça qualquer pergunta e eu te ajudo!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {message.role === 'assistant' ? (
                          <div className="text-sm whitespace-pre-wrap">
                            {parseMarkdown(message.content)}
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => {
                            if (speakingMessageId === message.id) {
                              stopSpeaking();
                            } else {
                              speakText(message.content, message.id);
                            }
                          }}
                          className="flex-shrink-0 text-red-500 hover:text-red-400 transition-colors p-1"
                          title={speakingMessageId === message.id ? 'Parar áudio' : 'Ouvir resposta'}
                        >
                          {speakingMessageId === message.id ? (
                            <Square className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg px-4 py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-700 p-4">
            <div className="flex gap-2">
              {hasSpeechSupport && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={cn(
                    'px-3 py-2 rounded-lg transition-colors flex items-center justify-center',
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  )}
                  title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
                >
                  {isRecording ? (
                    <Square className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRecording ? 'Gravando...' : 'Digite sua pergunta...'}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={isLoading || isRecording}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || isRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            {isRecording && (
              <div className="mt-2 text-xs text-red-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Gravando... Clique novamente para parar
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
