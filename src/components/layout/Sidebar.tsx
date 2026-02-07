'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dumbbell, FolderTree, Calendar, MapPin, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/exercicios', label: 'Exercícios', icon: Dumbbell },
  { href: '/dashboard/categorias', label: 'Categorias', icon: FolderTree },
  { href: '/dashboard/treinos', label: 'Treinos', icon: Calendar },
  { href: '/dashboard/academias', label: 'Academias', icon: MapPin },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 shadow-sm border-r border-gray-200 dark:border-gray-800 min-h-screen p-4 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-64'
        )}
      >
        <nav className="space-y-2 mt-12 lg:mt-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Para dashboard, apenas marca como ativo se for exatamente /dashboard
            // Para outras rotas, marca como ativo se for a rota exata ou começar com a rota + /
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-red-600 dark:bg-red-700 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
