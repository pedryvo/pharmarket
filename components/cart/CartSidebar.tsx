"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, Beaker, ChevronRight } from 'lucide-react';
import { fBRL, fG } from '@/lib/utils'; // I'll need to implement these helpers

interface CartItem {
  id: number;
  productId: number;
  name: string;
  ico?: string;
  dosePerCap: number;
  unit: string;
  price: number;
  rawCost: number;
}

interface CartSidebarProps {
  items: CartItem[];
  formulaName: string;
  onFormulaNameChange: (name: string) => void;
  caps: number;
  onCapsChange: (caps: number) => void;
  pharmaceuticalForm: string;
  onFormChange: (form: string) => void;
  forms: string[];
  onRemoveItem: (id: number) => void;
  onDoseChange: (id: number, dose: number) => void;
  onCheckout: () => void;
  total: number;
  capsTotal: number;
}

export const CartSidebar = ({
  items,
  formulaName,
  onFormulaNameChange,
  caps,
  onCapsChange,
  pharmaceuticalForm,
  onFormChange,
  forms,
  onRemoveItem,
  onDoseChange,
  onCheckout,
  total,
  capsTotal
}: CartSidebarProps) => {
  return (
    <aside className="bg-white border-l border-vitalab-border flex flex-col h-full overflow-hidden">
      <div className="cart-head p-4 pb-3 border-b border-vitalab-border flex-shrink-0">
        <div className="cart-head-title flex justify-between items-center text-[0.9rem] font-black text-vitalab-text">
          <div className="flex items-center gap-2">
            <Beaker size={16} className="text-vitalab-green" />
            Minha Fórmula
          </div>
          <span className="cart-badge bg-vitalab-orange text-white rounded-[12px] px-[0.5rem] py-[0.14rem] text-[0.68rem] font-bold">
            {items.length}
          </span>
        </div>
        <div className="cart-formula-name mt-2">
          <Input
            value={formulaName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormulaNameChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-vitalab-bg border-[1.5px] border-vitalab-border rounded-lg font-sans text-[0.78rem] text-vitalab-text outline-none focus-visible:ring-0 focus-visible:border-vitalab-green focus:bg-white transition-all placeholder:text-vitalab-text-muted h-9"
            placeholder="Nome da fórmula (ex: Imunidade…)"
            maxLength={60}
          />
        </div>
      </div>

      <div className="cart-meta p-3 px-5 border-b border-vitalab-border flex items-center gap-2 overflow-x-auto flex-shrink-0">
        <span className="caps-label text-[0.7rem] font-bold text-vitalab-text-secondary whitespace-nowrap">Cápsulas:</span>
        <div className="caps-ctrl flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-6.5 h-6.5 rounded-md border-[1.5px] border-vitalab-border text-vitalab-text hover:border-vitalab-green hover:text-vitalab-green shadow-none"
            onClick={() => onCapsChange(Math.max(10, caps - 10))}
          >
            <Minus size={12} />
          </Button>
          <span className="caps-val font-mono text-[0.82rem] font-bold min-w-[28px] text-center text-vitalab-text">
            {caps}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-6.5 h-6.5 rounded-md border-[1.5px] border-vitalab-border text-vitalab-text hover:border-vitalab-green hover:text-vitalab-green shadow-none"
            onClick={() => onCapsChange(Math.min(360, caps + 10))}
          >
            <Plus size={12} />
          </Button>
        </div>
        
        <select 
          className="form-sel-small flex-1 p-1 px-2 border-[1.5px] border-vitalab-border rounded-lg text-[0.72rem] font-bold font-sans bg-white text-vitalab-text outline-none cursor-pointer focus:border-vitalab-green"
          value={pharmaceuticalForm}
          onChange={(e) => onFormChange(e.target.value)}
        >
          {forms.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="cart-items flex-1 overflow-y-auto p-5 py-3 bg-vitalab-bg/30">
        {items.length === 0 ? (
          <div className="cart-empty text-center py-10 px-4 text-vitalab-text-muted text-[0.83rem] leading-[1.8]">
            <span className="cart-empty-ico text-[2.5rem] block mb-3 opacity-60">🧪</span>
            Monte sua fórmula selecionando ativos no catálogo.<br /><br />
            <span className="text-vitalab-green font-[700]">Dica:</span> Você pode combinar quantos ativos quiser em uma mesma fórmula.
          </div>
        ) : (
          items.map(it => (
            <div key={it.id} className="cart-item bg-white border border-vitalab-border rounded-xl px-3 py-3 mb-2 transition-all duration-150 hover:border-vitalab-green/30 group relative shadow-sm">
              <div className="cart-item-top flex justify-between items-start mb-2">
                <div className="cart-item-name text-[0.8rem] font-bold text-vitalab-text flex-1 pr-5 leading-[1.3]">
                  {it.ico || '💊'} {it.name}
                </div>
                <button 
                  onClick={() => onRemoveItem(it.id)}
                  className="cart-item-del text-vitalab-text-muted hover:text-red-500 transition-colors p-1 absolute top-2 right-2"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="cart-dose-row flex items-center gap-2 mb-2">
                <div className="relative">
                  <Input
                    type="number"
                    value={it.dosePerCap}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDoseChange(it.id, parseFloat(e.target.value))}
                    className="w-[64px] h-[26px] px-2 border border-vitalab-border rounded-md bg-white font-mono text-[0.72rem] text-vitalab-text text-center focus-visible:ring-0 focus-visible:border-vitalab-green transition-all"
                  />
                </div>
                <span className="dose-unit text-[0.65rem] text-vitalab-text-muted uppercase font-black tracking-wider">{it.unit}</span>
              </div>
              <div className="cart-item-price flex justify-between items-center mt-2 border-t border-dashed border-vitalab-border pt-2">
                <span className="ci-price font-mono text-[0.78rem] font-bold text-vitalab-green leading-none">
                  {fBRL(it.price)}
                </span>
                <span className="ci-detail text-[0.6rem] text-vitalab-text-muted leading-none font-bold uppercase tracking-tight">
                   MP: {fBRL(it.rawCost)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer p-5 py-4 border-t border-vitalab-border flex-shrink-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <div className="cart-breakdown mb-3 space-y-1">
          {items.map(it => (
            <div key={`bd-${it.id}`} className="flex justify-between text-[0.7rem] text-vitalab-text-muted font-medium">
              <span>{it.name} {it.dosePerCap}{it.unit}</span>
              <span className="font-mono text-vitalab-text-secondary">R$ {it.price.toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
          <div className="flex justify-between text-[0.7rem] text-vitalab-text-muted font-medium">
            <span>Embalagem ({caps} un.)</span>
            <span className="font-mono text-vitalab-text-secondary">R$ {capsTotal.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        
        <div className="cart-total-row flex justify-between items-center py-2 border-t border-vitalab-border mb-3">
          <span className="ct-label text-[0.78rem] font-black text-vitalab-text uppercase tracking-wider">Total</span>
          <span className="ct-val font-mono text-[1.1rem] font-bold text-vitalab-orange">
            {fBRL(total)}
          </span>
        </div>
        
        <Button 
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full bg-vitalab-orange text-white font-black hover:bg-vitalab-orange-d transition-all shadow-vitalab-md flex items-center justify-center gap-2 h-10 border-none rounded-xl"
        >
          Solicitar fórmula <ChevronRight size={16} />
        </Button>
      </div>
    </aside>
  );
};
