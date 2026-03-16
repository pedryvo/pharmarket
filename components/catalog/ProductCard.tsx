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
      className="prod-card bg-white border-[1.5px] border-vitalab-border rounded-vitalab-lg overflow-hidden cursor-pointer transition-all duration-200 hover:border-vitalab-green hover:shadow-vitalab-m hover:-translate-y-[2px] group relative"
    >
      <div className="prod-card-top bg-vitalab-green-extralight p-4 pt-[1.1rem] flex flex-col items-center justify-center min-h-[85px] relative">
        {product.ico && <div className="prod-card-ico text-[1.8rem] mb-1 group-hover:scale-110 transition-transform">{product.ico}</div>}
        <span 
          className="prod-cat-badge text-[0.6rem] font-[700] px-2 py-[0.1rem] rounded-[20px] uppercase tracking-[0.07em]"
          style={{ backgroundColor: product.category.bg, color: product.category.color }}
        >
          {product.category.label}
        </span>
      </div>
      
      <div className="prod-card-body p-[0.8rem] pt-[0.85rem] pb-[0.85rem]">
        <div className="prod-name text-[0.82rem] font-[700] text-vitalab-text mb-[0.15rem] line-clamp-2 leading-[1.3] h-[2.2rem]">
          {product.name}
        </div>
        <div className="prod-cpg text-[0.68rem] text-vitalab-text-secondary mb-[0.6rem] font-mono">
          R$ {product.cpg.toFixed(3).replace('.', ',')}/g
        </div>
        
        <Button 
          className={`w-full py-[0.35rem] h-7.5 text-[0.75rem] font-[700] transition-all shadow-none rounded-[8px]
            ${isInCart 
              ? 'bg-vitalab-green text-white hover:bg-vitalab-green' 
              : 'bg-vitalab-green-light border-[1.5px] border-vitalab-green/25 text-vitalab-green-d hover:bg-vitalab-green hover:text-white border-none'}`}
        >
          {isInCart ? '✓ Na fórmula' : '+ Adicionar'}
        </Button>
      </div>
      {isInCart && (
        <div className="prod-card-ribbon absolute top-[0.6rem] right-[0.6rem] bg-vitalab-orange text-white text-[0.62rem] font-[700] px-[0.45rem] py-[0.18rem] rounded-[6px] uppercase">
          SELECIONADO
        </div>
      )}
    </div>
  );
};
