"use client"

import { useState, useMemo } from 'react';
import { CategoryStrip } from './CategoryStrip';
import { ProductCard } from './ProductCard';

interface Category {
  id: string;
  label: string;
  ico: string;
  bg: string;
  color: string;
}

interface Product {
  id: number;
  name: string;
  categoryId: string;
  unit: string;
  ico?: string | null;
  desc?: string | null;
  cpg: number;
  category: Category;
}

interface Partner {
  id: number;
  name: string;
  city: string;
  specs: string[];
}

interface CatalogScreenProps {
  initialProducts: Product[];
  initialCategories: Category[];
  partners: Partner[];
  onAddItem: (productId: number) => void;
  cartProductIds: number[];
}

export const CatalogScreen = ({
  initialProducts,
  initialCategories,
  partners,
  onAddItem,
  cartProductIds
}: CatalogScreenProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id);
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return initialProducts;
    return initialProducts.filter(p => p.categoryId === activeCategory);
  }, [activeCategory, initialProducts]);

  return (
    <div className="catalog-col flex-1 overflow-y-auto bg-vitalab-bg min-h-0">
      {/* Hero Banner */}
      <div className="hero-banner bg-gradient-to-br from-vitalab-green-text via-vitalab-green to-vitalab-green-m p-[2.2rem] px-8 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 -right-[100px] -top-[150px]" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 left-[60%] -bottom-[80px]" />
        
        <div className="hero-content relative z-10">
          <h1 className="hero-title text-2xl font-extrabold text-white mb-2">Monte sua fórmula personalizada</h1>
          <p className="hero-sub text-[0.88rem] text-white/75 max-w-[480px] leading-relaxed">
            Selecione os ativos, defina a dosagem e quantidade. O farmacêutico da parceira escolhida revisa e aprova antes do preparo.
          </p>
          <div className="hero-badges flex gap-2 mt-5 flex-wrap">
            {['✓ Revisão farmacêutica', '✓ Preço por grama real', '✓ Retorno via WhatsApp'].map((b) => (
              <span key={b} className="hero-badge bg-white/15 border border-white/20 rounded-[20px] px-[0.85rem] py-[0.3rem] text-[0.76rem] text-white font-semibold backdrop-blur-sm">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Strip */}
      <div className="partners-strip p-8 py-6 bg-white border-b border-vitalab-border overflow-hidden">
        <h2 className="partners-title text-[0.72rem] font-bold uppercase tracking-widest text-vitalab-text-muted mb-4">Farmácias parceiras disponíveis</h2>
        <div className="partners-row flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {partners.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedPartnerId(p.id)}
              className={`partner-card flex-shrink-0 flex items-center gap-3 bg-vitalab-bg border-[1.5px] rounded-vitalab px-4 py-[0.6rem] cursor-pointer transition-all
                ${selectedPartnerId === p.id 
                  ? 'border-vitalab-green bg-vitalab-green-light' 
                  : 'border-vitalab-border hover:border-vitalab-green hover:bg-vitalab-green-light'}`}
            >
              <div className="partner-ico w-9 h-9 rounded-[9px] bg-vitalab-green-light flex items-center justify-center text-[17px]">🏥</div>
              <div>
                <div className={`partner-name text-[0.82rem] font-bold ${selectedPartnerId === p.id ? 'text-vitalab-green-text' : 'text-vitalab-text'}`}>{p.name}</div>
                <div className="partner-city text-[0.72rem] text-vitalab-text-muted">{p.city}</div>
              </div>
              {selectedPartnerId === p.id && (
                <div className="partner-tag text-[0.68rem] font-bold px-[0.45rem] py-[0.15rem] rounded-[5px] bg-vitalab-green-light text-vitalab-green ml-auto">
                  ✓ Selecionada
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Categories Strip */}
      <div className="bg-white sticky top-0 z-10 transition-shadow">
        <CategoryStrip 
          categories={initialCategories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      {/* Product Grid */}
      <div className="prod-section p-8 py-6">
        <h2 className="prod-section-title text-base font-extrabold text-vitalab-text mb-4">
          {activeCategory === 'all' ? 'Todos os ativos' : initialCategories.find(c => c.id === activeCategory)?.label}
        </h2>
        <div className="prod-grid grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-[0.9rem]">
          {filteredProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isInCart={cartProductIds.includes(p.id)}
              onAdd={onAddItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
