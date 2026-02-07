'use client';

import Link from 'next/link';
import { Dumbbell, FolderTree, Calendar, ArrowRight } from 'lucide-react';

const cards = [
  {
    title: 'Exercícios',
    description: 'Gerencie seus exercícios físicos, adicione vídeos do YouTube e organize por categorias',
    href: '/dashboard/exercicios',
    icon: Dumbbell,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
  },
  {
    title: 'Categorias',
    description: 'Organize seus exercícios em categorias como Peito, Costas, Pernas e muito mais',
    href: '/dashboard/categorias',
    icon: FolderTree,
    color: 'from-red-600 to-red-700',
    bgColor: 'bg-red-100 dark:bg-red-950/30',
  },
  {
    title: 'Treinos',
    description: 'Crie treinos personalizados combinando exercícios com séries, repetições e descanso',
    href: '/dashboard/treinos',
    icon: Calendar,
    color: 'from-red-700 to-red-800',
    bgColor: 'bg-red-200 dark:bg-red-950/40',
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie seus exercícios, categorias e treinos
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgColor} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                  {card.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {card.description}
                </p>
                <div className="flex items-center text-red-600 dark:text-red-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Acessar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
