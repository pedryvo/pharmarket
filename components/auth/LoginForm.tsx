"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Loader2, Leaf } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await onLogin(email, password);
      if (result && !result.success) {
        setError(result.error || 'Credenciais inválidas');
      }
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError(err.message || 'Erro ao realizar login');
      }
    } finally {
      // Small delay to allow redirect to happen if success
      // Or just set loading false if we have an error
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-vitalab-xl border-[1.5px] border-vitalab-border shadow-vitalab-lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-vitalab-green/10 rounded-vitalab-lg flex items-center justify-center mx-auto mb-4 text-vitalab-green">
          <Leaf size={32} />
        </div>
        <h1 className="text-2xl font-extrabold text-vitalab-text mb-2">Bem-vindo de volta</h1>
        <p className="text-vitalab-text-muted text-sm">Acesse sua conta para gerenciar fórmulas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[0.7rem] font-bold text-vitalab-text uppercase tracking-wider ml-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-vitalab-text-muted" size={18} />
            <Input 
              type="email" 
              placeholder="seu@email.com" 
              className="pl-10 h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[0.7rem] font-bold text-vitalab-text uppercase tracking-wider ml-1">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-vitalab-text-muted" size={18} />
            <Input 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-8 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-11 bg-vitalab-green hover:bg-vitalab-green/90 text-white font-bold rounded-vitalab-lg transition-all active:scale-95"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar no Sistema'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-vitalab-border text-center">
        <p className="text-[0.75rem] text-vitalab-text-muted">
          Ambiente seguro VitaLab — <span className="text-vitalab-orange font-bold">Portal do Cliente</span>
        </p>
      </div>
    </div>
  );
};
