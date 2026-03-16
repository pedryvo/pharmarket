"use client"

import { useState, useMemo } from 'react';
import { CategoryStrip } from './CategoryStrip';
import { ProductCard } from './ProductCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  label: string;
  bg: string;
  color: string;
}

interface Product {
  id: number;
  name: string;
  categoryId: string;
  unit: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = useMemo(() => {
    let result = initialProducts;
    
    if (activeCategory !== 'all') {
      result = result.filter(p => p.categoryId === activeCategory);
    }
    
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.desc?.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [activeCategory, initialProducts, searchTerm]);

  return (
    <div className="flex-1 bg-vitalab-bg pb-12">
      {/* Hero Banner */}
      <div className="hero-banner bg-gradient-to-br from-vitalab-green-d via-vitalab-green to-vitalab-green-m p-[2.2rem] px-8 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 -right-[100px] -top-[150px] animate-pulse" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 left-[60%] -bottom-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-[1.1] tracking-tight">
              Sua saúde sob medida, <br/>
              <span className="text-white/80">com precisão farmacêutica.</span>
            </h1>
            <p className="text-base md:text-lg text-white/90 font-medium mb-8 leading-relaxed">
              Manipule suas fórmulas com os melhores ativos do mercado e receba em casa com segurança e agilidade.
            </p>
          <div className="hero-badges flex gap-2 mt-5 flex-wrap">
            {['Revisao farmaceutica', 'Preco por grama real', 'Retorno via WhatsApp'].map((b) => (
              <span key={b} className="hero-badge bg-white/15 border border-white/20 rounded-[20px] px-[0.85rem] py-[0.3rem] text-[0.76rem] text-white font-semibold backdrop-blur-[4px]">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Strip */}
      <div className="partners-strip p-8 py-6 bg-white border-b border-vitalab-border overflow-hidden">
        <h2 className="partners-title text-[0.72rem] font-[700] uppercase tracking-[0.1em] text-vitalab-text-muted mb-4">Farmácias parceiras disponíveis</h2>
        <div className="partners-row flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {partners.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedPartnerId(p.id)}
              className={`partner-card flex-shrink-0 flex items-center gap-3 border-[1.5px] rounded-vitalab px-4 py-[0.6rem] cursor-pointer transition-all duration-180
                ${selectedPartnerId === p.id 
                  ? 'border-vitalab-green bg-vitalab-green-light' 
                  : 'bg-vitalab-bg border-vitalab-border hover:border-vitalab-green hover:bg-vitalab-green-light'}`}
            >
              <div className="hidden partner-ico w-9 h-9 rounded-[9px] bg-vitalab-green-light flex items-center justify-center text-[10px] font-black flex-shrink-0" />
              <div>
                {/* Assuming Badge is a component, adding a placeholder div for now */}
                <div className="bg-vitalab-green/10 text-vitalab-green-text border-vitalab-green/20 font-black text-[0.6rem] px-2 py-0.5 uppercase tracking-wider rounded">
                  Premium
                </div>
                <div className="text-[0.65rem] font-bold text-vitalab-text-muted uppercase tracking-widest mt-1">Ativos Certificados</div>
                <div className={`partner-name text-[0.82rem] font-[700] ${selectedPartnerId === p.id ? 'text-vitalab-green-text' : 'text-vitalab-text'}`}>{p.name}</div>
                <div className="partner-city text-[0.72rem] text-vitalab-text-muted">{p.city}</div>
              </div>
              {selectedPartnerId === p.id && (
                <div className="partner-tag text-[0.68rem] font-[700] px-[0.45rem] py-[0.15rem] rounded-[5px] bg-vitalab-green-light text-vitalab-green-d ml-auto">
                  Selecionada
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search and Categories Box */}
      <div className="bg-white sticky top-[60px] z-20 border-b border-vitalab-border shadow-sm pt-4">
        <div className="px-8 mb-4 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-vitalab-text-muted transition-colors group-focus-within:text-vitalab-green" />
            <Input 
              placeholder="Buscar ativo pelo nome ou benefício..."
              className="pl-10 pr-4 h-10 bg-vitalab-bg border-vitalab-border rounded-full text-[0.8rem] focus-visible:ring-0 focus-visible:border-vitalab-green transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CategoryStrip 
          categories={initialCategories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      {/* Product Grid */}
      <div className="prod-section p-8 py-6">
        <h2 className="prod-section-title text-[1rem] font-[800] text-vitalab-text mb-4">
          {activeCategory === 'all' ? 'Todos os ativos' : initialCategories.find(c => c.id === activeCategory)?.label}
        </h2>
        <div className="prod-grid grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-[0.9rem]">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-vitalab-border rounded-xl">
               <Search size={40} className="mx-auto mb-4 opacity-10 text-vitalab-text" />
               <p className="text-vitalab-text-muted text-[0.85rem] font-medium">Nenhum ativo encontrado para sua busca.</p>
               <Button 
                variant="link" 
                className="text-vitalab-green font-bold text-[0.8rem] mt-2"
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
               >
                 Limpar filtros
               </Button>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                isInCart={cartProductIds.includes(p.id)}
                onAdd={onAddItem}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
