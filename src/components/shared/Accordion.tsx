'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  darkOnly?: boolean;
}

export function Accordion({ title, children, defaultOpen = false, className, darkOnly = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (darkOnly) {
    return (
      <div className={cn('border border-gray-700 rounded-lg overflow-hidden bg-gray-800', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left"
        >
          <div className="flex-1">{title}</div>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2',
              isOpen && 'transform rotate-180'
            )}
          />
        </button>
        {isOpen && (
          <div className="px-4 pb-4 border-t border-gray-700 bg-gray-900/50">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
      >
        <div className="flex-1">{title}</div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {children}
        </div>
      )}
    </div>
  );
}
