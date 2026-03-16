"use client"

import Link from 'next/link';
import { Search, ShoppingCart, LogOut, LayoutDashboard, User as UserIcon, Settings, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  user: {
    name: string;
    role: 'CLIENT' | 'PHARMA' | 'ADMIN';
    email?: string;
  };
  onLogoClick: () => void;
  onLogout: () => void;
  cartCount: number;
}

export const Navbar = ({ user, cartCount, onLogoClick, onLogout }: NavbarProps) => {
  return (
    <nav className="navbar h-[60px] flex items-center gap-4 px-8 sticky top-0 z-40 bg-white border-b border-vitalab-border shadow-[0_1px_0_var(--color-vitalab-border)]">
      <Link 
        href="/" 
        onClick={(e) => {
          e.preventDefault();
          onLogoClick();
        }}
        className="nav-logo flex items-center gap-[0.6rem] no-underline text-lg font-[800] text-vitalab-green tracking-[-0.02em] hover:opacity-90 transition-opacity"
      >
        <div className="nav-logo-ico w-[30px] h-[30px] bg-vitalab-green rounded-[8px] flex items-center justify-center text-white text-[14px] shadow-vitalab-s">
          <Leaf size={16} fill="currentColor" />
        </div>
        VitaLab
      </Link>
      

      <div className="nav-right flex items-center gap-[0.7rem] ml-auto">
        {user && (
          <div className="nav-user flex items-center gap-2 bg-vitalab-green-light border border-vitalab-green/20 rounded-[20px] px-[0.9rem] py-[0.32rem] text-[0.82rem] font-[600] text-vitalab-green-text">
            <span className={`w-[7px] h-[7px] rounded-full animate-pulse ${user.role === 'PHARMA' ? 'bg-vitalab-orange' : user.role === 'ADMIN' ? 'bg-red-500' : 'bg-vitalab-green'}`} />
            <span>{user.name}</span>
          </div>
        )}
        
        <Button 
          variant="ghost"
          onClick={onLogout}
          className="h-8 px-3 rounded-[20px] font-[700] text-[0.78rem] text-vitalab-text-secondary hover:text-red-500 hover:bg-red-50 transition-all gap-2"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </nav>
  );
};
