import React, { useState } from 'react';
import { Search, History, Bell, HelpCircle, Activity } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8 z-20 transition-all duration-300">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-outline group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Buscar reportes, proyectos, tareas o métricas..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline/70"
          />
        </div>
      </div>

      {/* Title & Actions */}
      <div className="flex items-center gap-4">
        <button className="size-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <History className="size-4.5" />
        </button>
        <button className="size-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer relative">
          <Bell className="size-4.5" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-surface animate-pulse"></span>
        </button>
        <button className="size-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <HelpCircle className="size-4.5" />
        </button>

        <div className="h-7 w-[1px] bg-outline-variant mx-2"></div>

        <div className="flex items-center gap-3">
          <h2 className="font-headline text-base font-semibold text-on-surface tracking-tight">
            {title}
          </h2>
          <div className="size-8 rounded-lg bg-primary/20 border border-primary flex items-center justify-center overflow-hidden">
            <Activity className="size-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
};
