import React, { useState } from 'react';
import { AuthMode } from '../types';
import { Activity, Mail, Lock, User, ArrowRight, RefreshCw, Terminal, Compass, Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  return (
    <div className="bg-background text-on-background min-h-screen w-full flex items-center justify-center relative overflow-hidden select-none p-6">
      {/* Background Texture & Ambient Lights */}
      <div className="absolute inset-0 technical-bg pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary-container/15 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-secondary-container/15 blur-[140px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-[420px]">
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Branding Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="size-16 mb-5 bg-primary-container/20 border border-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
              <Activity className="size-9 text-primary animate-pulse" />
            </div>
            <h1 className="text-on-surface font-headline text-2xl font-bold tracking-tight text-center mb-2">
              {mode === 'register' ? 'Crea tu cuenta' : 'Bienvenido a ZenFlow'}
            </h1>
            <p className="text-on-surface-variant font-body text-sm text-center">
              {mode === 'register'
                ? 'Únete a la plataforma de productividad inteligente'
                : 'Accede a tu inteligencia de productividad'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label className="block font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-outline" />
                  <input
                    required
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-xl px-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-outline" />
                <input
                  required
                  type="email"
                  defaultValue="ing.wplanchez@gmail.com"
                  placeholder="nombre@empresa.com"
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-xl px-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant font-label"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                  Contraseña
                </label>
                {mode === 'login' && (
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-primary hover:underline text-xs font-medium transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-outline" />
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  defaultValue="password123"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-xl px-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant font-label"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <RefreshCw className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-outline" />
                  <input
                    required
                    type="password"
                    defaultValue="password123"
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-xl px-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant font-label"
                  />
                </div>
              </div>
            )}

            <div className="pt-3">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-primary hover:brightness-110 text-on-primary font-bold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <RefreshCw className="size-5 animate-spin text-on-primary" />
                ) : (
                  <>
                    <span>{mode === 'register' ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                    <ArrowRight className="size-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-7">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="px-3 font-label text-[10px] text-outline font-medium tracking-tighter uppercase">
              o continuar con
            </span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Social Connectors */}
          <div className="grid grid-cols-2 gap-3.5">
            <button 
              onClick={() => onLoginSuccess()}
              type="button"
              className="flex items-center justify-center gap-2.5 bg-surface-container-high border border-outline-variant hover:border-primary hover:bg-surface-container-highest rounded-xl py-2.5 transition-all duration-200 cursor-pointer"
            >
              <Terminal className="size-4.5 text-primary" />
              <span className="text-sm font-medium text-on-surface">Git</span>
            </button>
            <button 
              onClick={() => onLoginSuccess()}
              type="button"
              className="flex items-center justify-center gap-2.5 bg-surface-container-high border border-outline-variant hover:border-primary hover:bg-surface-container-highest rounded-xl py-2.5 transition-all duration-200 cursor-pointer"
            >
              <Compass className="size-4.5 text-secondary" />
              <span className="text-sm font-medium text-on-surface">Jira</span>
            </button>
          </div>

          {/* Footer Toggle */}
          <div className="mt-8 pt-5 border-t border-outline-variant/30 text-center">
            <p className="text-on-surface-variant text-xs">
              {mode === 'register' ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                className="text-primary font-semibold hover:underline underline-offset-4 cursor-pointer ml-1"
              >
                {mode === 'register' ? 'Inicia sesión aquí' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-5 flex justify-between items-center px-3 font-label text-[10px] text-outline uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#4fdbc8]"></div>
            <span>Sistema en línea</span>
          </div>
          <span>v2.4.0 Stable (ES)</span>
        </div>
      </main>
    </div>
  );
};
