"use client"

import Link from 'next/link';
import { Search, LogOut, ShoppingBag, Beaker, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  user?: {
    name: string;
    role: 'CLIENT' | 'PHARMA' | 'ADMIN';
  };
  onLogout?: () => void;
  onViewOrders?: () => void;
  onSearch?: (q: string) => void;
  cartCount?: number;
}

export const Navbar = ({ user, onLogout, onViewOrders, onSearch, cartCount = 0 }: NavbarProps) => {
  return (
    <nav className="navbar h-[60px] flex items-center gap-4 px-8 sticky top-0 z-[100] bg-white border-b border-vitalab-border shadow-[0_1px_0_var(--vitalab-border)]">
      <Link href="/" className="nav-logo flex items-center gap-[0.6rem] no-underline text-xl font-extrabold text-vitalab-green tracking-[-0.02em]">
        <div className="nav-logo-ico w-[34px] h-[34px] bg-vitalab-green rounded-[9px] flex items-center justify-center text-white text-base">
          <Beaker size={18} />
        </div>
        VitaLab
      </Link>
      
      <div className="nav-search flex-1 max-w-[440px] relative">
        <span className="nav-search-ico absolute left-[0.85rem] top-1/2 -translate-y-1/2 text-vitalab-text-muted text-[0.95rem] pointer-events-none">
          <Search size={16} />
        </span>
        <Input 
          id="srch" 
          placeholder="Buscar ativo…" 
          className="w-full pl-10 pr-4 py-[0.6rem] bg-vitalab-bg border-[1.5px] border-vitalab-border rounded-[30px] font-sans text-[0.88rem] text-vitalab-text outline-none focus:border-vitalab-green focus:bg-white transition-all"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="nav-right flex items-center gap-[0.7rem] ml-auto">
        {user && (
          <div className="nav-user flex items-center gap-2 bg-vitalab-green-light border border-vitalab-green/20 rounded-[20px] px-[0.9rem] py-[0.32rem] text-[0.82rem] font-semibold text-vitalab-green">
            <span className={`w-[7px] h-[7px] rounded-full ${user.role === 'PHARMA' ? 'bg-vitalab-orange' : user.role === 'ADMIN' ? 'bg-red-500' : 'bg-vitalab-green'}`} />
            <span>{user.name}</span>
          </div>
        )}
        
        {user?.role === 'CLIENT' && (
          <Button variant="ghost" size="sm" onClick={onViewOrders} className="text-vitalab-text-secondary hover:text-vitalab-green">
            <FileText size={16} className="mr-1" />
            Meus Pedidos
          </Button>
        )}
        
        <Button variant="ghost" size="sm" onClick={onLogout} className="text-vitalab-text-secondary hover:text-red-500">
          <LogOut size={16} className="mr-1" />
          Sair
        </Button>
      </div>
    </nav>
  );
};
