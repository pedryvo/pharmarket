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
    <aside className="cart-sidebar w-[380px] flex-shrink-0 bg-white border-l border-vitalab-border flex flex-col h-full overflow-hidden">
      <div className="cart-head p-4 pb-3 border-b border-vitalab-border flex-shrink-0">
        <div className="cart-head-title flex justify-between items-center text-base font-extrabold text-vitalab-text">
          <div className="flex items-center gap-2">
            <Beaker size={18} className="text-vitalab-green" />
            Minha Fórmula
          </div>
          <span className="cart-badge bg-vitalab-orange text-white rounded-[12px] px-[0.6rem] py-[0.18rem] text-[0.75rem] font-bold">
            {items.length}
          </span>
        </div>
        <div className="cart-formula-name mt-[0.7rem]">
          <Input
            value={formulaName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormulaNameChange(e.target.value)}
            className="cart-fname-input w-full px-3 py-2 bg-vitalab-bg border-[1.5px] border-vitalab-border rounded-[8px] font-sans text-[0.83rem] text-vitalab-text outline-none focus:border-vitalab-green focus:bg-white"
            placeholder="Nome da fórmula (ex: Imunidade…)"
            maxLength={60}
          />
        </div>
      </div>

      <div className="cart-meta p-3 px-5 border-b border-vitalab-border flex items-center gap-2 overflow-x-auto flex-shrink-0">
        <span className="caps-label text-[0.75rem] font-semibold text-vitalab-text-secondary whitespace-nowrap">Cápsulas:</span>
        <div className="caps-ctrl flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-7 h-7 rounded-[7px] border-[1.5px] border-vitalab-border text-vitalab-text hover:border-vitalab-green hover:text-vitalab-green shadow-none"
            onClick={() => onCapsChange(Math.max(10, caps - 10))}
          >
            <Minus size={14} />
          </Button>
          <span className="caps-val font-mono text-[0.88rem] font-bold min-w-[30px] text-center text-vitalab-text">
            {caps}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-7 h-7 rounded-[7px] border-[1.5px] border-vitalab-border text-vitalab-text hover:border-vitalab-green hover:text-vitalab-green shadow-none"
            onClick={() => onCapsChange(Math.min(360, caps + 10))}
          >
            <Plus size={14} />
          </Button>
        </div>
        
        <select 
          className="form-sel-small flex-1 p-[0.38rem] px-2 border-[1.5px] border-vitalab-border rounded-[8px] text-[0.78rem] font-sans bg-white text-vitalab-text outline-none cursor-pointer focus:border-vitalab-green"
          value={pharmaceuticalForm}
          onChange={(e) => onFormChange(e.target.value)}
        >
          {forms.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="cart-items flex-1 overflow-y-auto p-5 py-3">
        {items.length === 0 ? (
          <div className="cart-empty text-center py-10 px-4 text-vitalab-text-muted text-[0.83rem] leading-[1.8]">
            <span className="cart-empty-ico text-[2.5rem] block mb-3">🧪</span>
            Monte sua fórmula selecionando ativos no catálogo.<br /><br />
            <span className="text-vitalab-green font-bold">Dica:</span> Você pode combinar quantos ativos quiser em uma mesma fórmula.
          </div>
        ) : (
          items.map(it => (
            <div key={it.id} className="cart-item bg-vitalab-bg border-[1.5px] border-vitalab-border rounded-vitalab-lg p-3 pt-3 mb-2 transition-all hover:border-vitalab-text-muted group">
              <div className="cart-item-top flex justify-between items-start mb-2">
                <div className="cart-item-name text-[0.85rem] font-bold text-vitalab-text flex-1 pr-2 leading-[1.3]">
                  {it.ico || '💊'} {it.name}
                </div>
                <button 
                  onClick={() => onRemoveItem(it.id)}
                  className="cart-item-del text-vitalab-text-muted hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="cart-dose-row flex items-center gap-2 mb-2">
                <Input
                  type="number"
                  value={it.dosePerCap}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDoseChange(it.id, parseFloat(e.target.value))}
                  className="w-20 h-7 px-2 border-[1.5px] border-vitalab-border rounded-[7px] bg-white font-mono text-[0.76rem] text-vitalab-text text-center focus:border-vitalab-green"
                />
                <span className="dose-unit text-[0.72rem] text-vitalab-text-muted">{it.unit}</span>
              </div>
              <div className="cart-item-price flex justify-between items-center mt-2 border-t border-vitalab-border/50 pt-2">
                <span className="ci-price font-mono text-[0.82rem] font-bold text-vitalab-green leading-none">
                  R$ {it.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="ci-detail text-[0.68rem] text-vitalab-text-muted leading-none">
                   MP: R$ {it.rawCost.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer p-5 py-4 border-t border-vitalab-border flex-shrink-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <div className="cart-breakdown mb-3 space-y-1">
          {items.map(it => (
            <div key={`bd-${it.id}`} className="flex justify-between text-[0.76rem] text-vitalab-text-muted">
              <span>{it.name} {it.dosePerCap}{it.unit}</span>
              <span className="font-mono text-vitalab-text-secondary">R$ {it.price.toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
          <div className="flex justify-between text-[0.76rem] text-vitalab-text-muted">
            <span>Embalagem ({caps} un.)</span>
            <span className="font-mono text-vitalab-text-secondary">R$ {capsTotal.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        
        <div className="cart-total-row flex justify-between items-center py-2 border-t border-vitalab-border mb-3">
          <span className="ct-label text-[0.85rem] font-bold text-vitalab-text">Total</span>
          <span className="ct-val font-mono text-[1.2rem] font-bold text-vitalab-orange">
            R$ {total.toFixed(2).replace('.', ',')}
          </span>
        </div>
        
        <Button 
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full bg-vitalab-orange text-white font-bold hover:bg-vitalab-orange/90 transition-all shadow-[0_6px_18px_rgba(242,112,33,0.28)]"
        >
          Solicitar fórmula <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </aside>
  );
};
