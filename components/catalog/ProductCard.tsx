"use client"

import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    ico?: string | null;
    cpg: number;
    category: {
      label: string;
      bg: string;
      color: string;
    };
  };
  isInCart?: boolean;
  onAdd: (id: number) => void;
}

export const ProductCard = ({ product, isInCart, onAdd }: ProductCardProps) => {
  return (
    <div 
      onClick={() => onAdd(product.id)}
      className="prod-card bg-white border-[1.5px] border-vitalab-border rounded-vitalab-lg overflow-hidden cursor-pointer transition-all hover:border-vitalab-green hover:shadow-vitalab-m hover:-translate-y-[2px]"
    >
      <div className="prod-card-top bg-vitalab-green-extralight p-4 flex flex-col items-center justify-center min-h-[90px] relative">
        {product.ico && <div className="prod-card-ico text-[2rem] mb-1">{product.ico}</div>}
        <span 
          className="prod-cat-badge text-[0.65rem] font-bold px-2 py-[0.15rem] rounded-[20px] uppercase tracking-[0.07em]"
          style={{ backgroundColor: product.category.bg, color: product.category.color }}
        >
          {product.category.label}
        </span>
      </div>
      
      <div className="prod-card-body p-[0.85rem] pt-[0.95rem]">
        <div className="prod-name text-[0.9rem] font-bold text-vitalab-text mb-[0.2rem] leading-[1.3]">
          {product.name}
        </div>
        <div className="prod-cpg text-[0.72rem] text-vitalab-text-muted mb-[0.6rem] font-mono">
          R$ {product.cpg.toFixed(3).replace('.', ',')}/g
        </div>
        
        <Button 
          className={`w-full py-[0.42rem] h-8 text-[0.82rem] font-bold transition-all shadow-none
            ${isInCart 
              ? 'bg-vitalab-green text-white hover:bg-vitalab-green' 
              : 'bg-vitalab-green-light border-[1.5px] border-vitalab-green/25 text-vitalab-green hover:bg-vitalab-green hover:text-white'}`}
        >
          {isInCart ? '✓ Na fórmula' : '+ Adicionar'}
        </Button>
      </div>
    </div>
  );
};
