'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Dumbbell, 
  Sparkles, 
  Zap, 
  Shield, 
  Smartphone, 
  QrCode, 
  MessageCircle,
  Check,
  ArrowRight,
  Play,
  Clock,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export function LandingPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999';

  const abrirWhatsApp = () => {
    const mensagem = encodeURIComponent('Olá! Gostaria de saber mais sobre o GymNFC para minha academia.');
    window.open(`https://wa.me/${whatsappNumber}?text=${mensagem}`, '_blank');
  };

  const features = [
    {
      icon: Smartphone,
      title: 'Acesso via NFC/QR Code',
      description: 'Alunos acessam treinos instantaneamente aproximando o celular ou escaneando o QR Code',
    },
    {
      icon: Sparkles,
      title: 'Personal Trainer IA',
      description: 'Assistente inteligente que responde dúvidas sobre exercícios e treinos em tempo real',
    },
    {
      icon: Dumbbell,
      title: 'Treinos Personalizados',
      description: 'Crie treinos completos com séries, repetições, descanso e vídeos demonstrativos',
    },
    {
      icon: Shield,
      title: 'Controle de Acesso',
      description: 'Acesso restrito por geolocalização - apenas dentro da academia cadastrada',
    },
    {
      icon: Clock,
      title: 'Timer de Descanso',
      description: 'Timer integrado para controlar o tempo de descanso entre séries',
    },
    {
      icon: TrendingUp,
      title: 'Acompanhamento',
      description: 'Alunos marcam exercícios concluídos e recebem feedback ao finalizar treinos',
    },
  ];

  const beneficios = [
    'Reduz necessidade de personal trainers físicos',
    'Melhora a experiência dos alunos na academia',
    'Aumenta a retenção de alunos',
    'Diferencial competitivo no mercado',
    'Fácil implementação e uso',
    'Suporte 24/7 com IA',
  ];

  const comoFunciona = [
    {
      step: 1,
      title: 'Cadastre sua Academia',
      description: 'Registre sua academia com localização e informações básicas',
      icon: Users,
    },
    {
      step: 2,
      title: 'Crie Treinos e Exercícios',
      description: 'Adicione exercícios com vídeos e crie treinos personalizados',
      icon: Dumbbell,
    },
    {
      step: 3,
      title: 'Gere QR Codes',
      description: 'Gere QR codes personalizados com logo da sua academia para impressão',
      icon: QrCode,
    },
    {
      step: 4,
      title: 'Alunos Acessam',
      description: 'Alunos escaneiam e acessam treinos completos com IA para dúvidas',
      icon: Smartphone,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo width={120} height={40} />
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
              >
                Entrar
              </Link>
              <button
                onClick={abrirWhatsApp}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Revolucione sua Academia com Inteligência Artificial</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              GymNFC
              <span className="block text-red-600 dark:text-red-500 mt-2">
                A Plataforma de Treinos Mais Inteligente
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transforme sua academia com tecnologia NFC, QR Code e Personal Trainer com Inteligência Artificial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={abrirWhatsApp}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Falar com Especialista
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/login"
                className="bg-white dark:bg-gray-800 border-2 border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                Ver Demonstração
                <Play className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acesso Instantâneo</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Alunos acessam treinos em segundos usando NFC ou QR Code
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">IA Inteligente</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Personal trainer virtual que responde dúvidas 24/7
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Diferencial Competitivo</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Destaque-se no mercado com tecnologia de ponta
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Funcionalidades que Transformam sua Academia
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Tudo que você precisa para modernizar sua academia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Implementação simples e rápida
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {comoFunciona.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
                {item.step < comoFunciona.length && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-red-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Benefícios para sua Academia
              </h2>
              <div className="space-y-4">
                {beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{beneficio}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 sm:p-12 text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">Pronto para Transformar sua Academia?</h3>
              <p className="text-lg mb-8 text-red-100">
                Fale com nosso time e descubra como o GymNFC pode revolucionar a experiência dos seus alunos
              </p>
              <button
                onClick={abrirWhatsApp}
                className="w-full bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp Agora
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Comece Hoje Mesmo
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Entre em contato e descubra como podemos ajudar sua academia a crescer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={abrirWhatsApp}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </button>
            <Link
              href="/login"
              className="bg-white dark:bg-gray-700 border-2 border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              Ver Demonstração
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo width={120} height={40} />
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} GymNFC. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
