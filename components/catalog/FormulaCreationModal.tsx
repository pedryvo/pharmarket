"use client"

import { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Trash2, 
  Beaker, 
  ChevronRight, 
  Minus, 
  Info,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react';
import { fBRL } from '@/lib/utils';

interface Category {
  id: string;
  label: string;
}

interface Product {
  id: number;
  name: string;
  categoryId: string;
  unit: string;
  desc?: string | null;
  cpg: number;
  partnerId: number;
}

interface FormulaCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  forms: string[];
  initialItems: any[];
  onAddItem: (productId: number) => void;
  onRemoveItem: (id: number) => void;
  onDoseChange: (id: number, dose: number) => void;
  onCapsChange: (caps: number) => void;
  onFormChange: (form: string) => void;
  onFormulaNameChange: (name: string) => void;
  onSubmit: () => void;
  formulaName: string;
  caps: number;
  pharmaceuticalForm: string;
  pricing: {
    total: number;
    capsTotal: number;
  };
  partners: any[];
  selectedPartnerId?: number;
  onPartnerChange: (id: number) => void;
}

export const FormulaCreationModal = ({
  isOpen,
  onClose,
  products,
  categories,
  forms,
  initialItems,
  onAddItem,
  onRemoveItem,
  onDoseChange,
  onCapsChange,
  onFormChange,
  onFormulaNameChange,
  onSubmit,
  formulaName,
  caps,
  pharmaceuticalForm,
  pricing,
  partners,
  selectedPartnerId,
  onPartnerChange
}: FormulaCreationModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.partnerId === selectedPartnerId);
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
  }, [products, activeCategory, searchTerm, selectedPartnerId]);

  const handleDragStart = (e: React.DragEvent, productId: number) => {
    e.dataTransfer.setData('productId', productId.toString());
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const productId = e.dataTransfer.getData('productId');
    if (productId) {
      onAddItem(parseInt(productId));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] p-0 overflow-hidden border-none rounded-3xl flex flex-col bg-vitalab-bg">
        <DialogHeader className="p-6 px-8 bg-white border-b border-vitalab-border flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-vitalab-green-light rounded-xl flex items-center justify-center text-vitalab-green">
              <Plus size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-vitalab-text tracking-tight">Criar Nova Fórmula</DialogTitle>
              <DialogDescription className="text-[0.65rem] font-bold text-vitalab-text-muted uppercase tracking-widest mt-0.5 opacity-70">
                Personalize sua manipulação com precisão
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex flex-col text-right mr-2 bg-vitalab-bg/50 px-3 py-1.5 rounded-xl border border-vitalab-border">
                <span className="text-[0.55rem] font-black text-vitalab-text-muted uppercase tracking-wider block">Farmácia Selecionada</span>
                <select 
                  value={selectedPartnerId || ''}
                  onChange={(e) => onPartnerChange(parseInt(e.target.value))}
                  className="bg-transparent border-none text-[0.75rem] font-black text-vitalab-green outline-none cursor-pointer"
                >
                  {!selectedPartnerId && <option value="" disabled>Selecionar...</option>}
                  {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
             </div>
             <div className="hidden md:block text-right mr-4">
                <span className="text-[0.6rem] font-black text-vitalab-text-muted uppercase tracking-wider block">Total Estimado</span>
                <span className="text-xl font-black text-vitalab-green">{fBRL(pricing.total)}</span>
             </div>
             <Button variant="outline" className="rounded-xl border-vitalab-border h-9 px-4 font-black text-xs" onClick={onClose}>Cancelar</Button>
             <Button 
                disabled={initialItems.length === 0}
                onClick={onSubmit}
                className="bg-vitalab-green hover:bg-vitalab-green-text text-white font-black h-9 px-6 rounded-xl shadow-vitalab-md gap-2 text-xs"
             >
                Solicitar Orçamento <ChevronRight size={14} />
             </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden relative">
          {!selectedPartnerId ? (
            <div className="absolute inset-0 z-10 bg-vitalab-bg flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
              <div className="max-w-4xl w-full">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-vitalab-green/10 rounded-2xl flex items-center justify-center text-vitalab-green mx-auto mb-4">
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-vitalab-text mb-2">Selecione uma Farmácia</h3>
                  <p className="text-vitalab-text-secondary text-sm font-medium">Cada farmácia possui seu próprio catálogo de ativos e prazos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {partners.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onPartnerChange(p.id)}
                      className="group p-8 bg-white border-2 border-vitalab-border rounded-3xl text-left hover:border-vitalab-green hover:shadow-vitalab-xl transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="hidden w-14 h-14 bg-vitalab-bg rounded-2xl flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-black text-xl text-vitalab-text group-hover:text-vitalab-green transition-colors">{p.name}</div>
                          <div className="text-[0.7rem] font-bold text-vitalab-text-muted uppercase tracking-widest mt-1 flex items-center gap-2">
                            <span>{p.city}</span>
                            <span className="w-1 h-1 bg-vitalab-border rounded-full" />
                            <span>Parceiro Verificado</span>
                          </div>
                          {p.specs && p.specs.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {p.specs.slice(0, 3).map((s: string, i: number) => (
                                <span key={i} className="text-[0.6rem] font-black text-vitalab-green bg-vitalab-green/5 px-2 py-0.5 rounded-full uppercase">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-vitalab-bg flex items-center justify-center text-vitalab-text-muted group-hover:bg-vitalab-green group-hover:text-white transition-all">
                        <ChevronRight size={22} />
                      </div>
                    </button>
                  ))}
                </div>
                
                <p className="text-center mt-12 text-[0.7rem] font-bold text-vitalab-text-muted uppercase tracking-[0.2em] opacity-50">
                  VitaLab Professional Marketplace
                </p>
              </div>
            </div>
          ) : (
            <>
          {/* Left Side: Search and Selection */}
          <div className="flex-1 flex flex-col bg-white border-r border-vitalab-border overflow-hidden">
            <div className="p-4 pb-0 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-vitalab-text-muted" />
                <Input 
                  placeholder="Procure por ativos (ex: Zinco, Vitamina C, Ansiedade...)"
                  className="pl-10 pr-4 h-11 bg-vitalab-bg border-vitalab-border rounded-xl text-[0.85rem] font-medium focus-visible:ring-0 focus-visible:border-vitalab-green transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="cat-scroll flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-[0.65rem] font-bold transition-all
                    ${activeCategory === 'all' 
                      ? 'bg-vitalab-green border-vitalab-green text-white shadow-vitalab-sm' 
                      : 'bg-white border-vitalab-border text-vitalab-text-muted hover:border-vitalab-green hover:text-vitalab-green'}`}
                >
                  <span className="font-black">*</span> Todos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-[0.65rem] font-bold transition-all
                      ${activeCategory === cat.id 
                        ? 'bg-vitalab-green border-vitalab-green text-white shadow-vitalab-sm' 
                        : 'bg-white border-vitalab-border text-vitalab-text-muted hover:border-vitalab-green hover:text-vitalab-green'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 gap-3 content-start">
              {filteredProducts.map(p => {
                const isInCart = initialItems.some(it => it.productId === p.id);
                return (
                  <div 
                    key={p.id}
                    draggable={!isInCart}
                    onDragStart={(e) => handleDragStart(e, p.id)}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group cursor-grab active:cursor-grabbing
                      ${isInCart 
                        ? 'bg-vitalab-green/5 border-vitalab-green ring-1 ring-vitalab-green/20 opacity-50 cursor-not-allowed' 
                        : 'bg-white border-vitalab-border hover:border-vitalab-green/40 hover:shadow-vitalab-s'}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 bg-vitalab-bg rounded-xl flex items-center justify-center text-[10px] font-black">LAB</div>
                        {isInCart && (
                          <div className="bg-vitalab-green text-white p-1 rounded-full">
                            <CheckCircle2 size={12} />
                          </div>
                        )}
                      </div>
                      <h4 className="text-[0.85rem] font-black text-vitalab-text leading-tight mb-1">{p.name}</h4>
                      <p className="text-[0.65rem] text-vitalab-text-muted font-medium line-clamp-2 leading-relaxed h-8">
                        {p.desc || 'Ativo farmacêutico de alta pureza'}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-dashed border-vitalab-border flex justify-between items-center">
                      <span className="text-[0.7rem] font-black text-vitalab-green">{fBRL(p.cpg)}/g</span>
                      <Button 
                        size="sm" 
                        disabled={isInCart}
                        onClick={() => onAddItem(p.id)}
                        className={`h-8 rounded-lg font-black text-xs ${isInCart ? 'bg-transparent text-vitalab-green' : 'bg-vitalab-green text-white hover:bg-vitalab-green-text'}`}
                      >
                        {isInCart ? 'Adicionado' : 'Adicionar'}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-3 opacity-60">
                   <div className="w-16 h-16 bg-vitalab-bg rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={32} />
                   </div>
                   <p className="font-bold text-vitalab-text">Nenhum ativo encontrado</p>
                   <p className="text-xs text-vitalab-text-muted">Tente ajustar sua busca ou categoria</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Formula Configuration */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            className={`w-[360px] bg-vitalab-bg flex flex-col overflow-hidden shrink-0 transition-all relative
              ${isDraggingOver ? 'ring-4 ring-inset ring-vitalab-green/20 bg-vitalab-green/5' : ''}`}
          >
            {isDraggingOver && (
              <div className="absolute inset-0 bg-vitalab-green/10 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 pointer-events-none">
                <div className="w-16 h-16 bg-vitalab-green text-white rounded-full flex items-center justify-center shadow-vitalab-md mb-4 ring-8 ring-white/50">
                   <Plus size={24} />
                </div>
                <h3 className="text-lg font-black text-vitalab-green">Solte para Adicionar</h3>
                <p className="text-[0.7rem] font-bold text-vitalab-green-text mt-2">O ativo será incluído na sua composição</p>
              </div>
            )}
            <div className="p-6 pb-4 shrink-0">
              <h3 className="text-[0.6rem] font-black text-vitalab-text-muted uppercase tracking-[0.2em] mb-3">Configuração da Fórmula</h3>
              <Input 
                placeholder="Nome da sua fórmula (ex: Imunidade Plus)"
                value={formulaName}
                onChange={(e) => onFormulaNameChange(e.target.value)}
                className="h-10 bg-white border-vitalab-border rounded-lg font-bold text-xs focus:border-vitalab-green shadow-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="space-y-2">
                <span className="text-[0.6rem] font-black text-vitalab-text-muted uppercase tracking-widest block pl-1">Minha Composição</span>
                {initialItems.length === 0 ? (
                  <div className="p-6 border border-dashed border-vitalab-border rounded-xl text-center bg-white/50">
                    <p className="text-[0.65rem] font-bold text-vitalab-text-muted leading-relaxed">
                      Selecione os ativos ao lado para criar sua fórmula personalizada.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {initialItems.map(it => (
                      <div key={it.id} className="bg-white border border-vitalab-border rounded-lg p-2.5 px-3 shadow-sm animate-in slide-in-from-right-2">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black text-vitalab-text truncate pr-4">{it.name}</span>
                          <button onClick={() => onRemoveItem(it.id)} className="text-vitalab-text-secondary hover:text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="flex-1 relative">
                             <Input 
                                type="number" 
                                value={it.dosePerCap}
                                onChange={(e) => onDoseChange(it.id, parseFloat(e.target.value))}
                                className="h-7 pl-7 pr-1 bg-vitalab-bg border-none font-mono text-[0.65rem] font-black text-vitalab-text rounded focus:ring-1 focus:ring-vitalab-green/30"
                             />
                             <Beaker size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-vitalab-text-muted" />
                           </div>
                           <span className="text-[0.55rem] font-black text-vitalab-text-muted uppercase tracking-wider">{it.unit}</span>
                           <div className="text-right min-w-[50px]">
                              <span className="text-xs font-mono font-black text-vitalab-green">{fBRL(it.price)}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <span className="text-[0.65rem] font-black text-vitalab-text-muted uppercase tracking-widest block pl-1">Quantidade</span>
                  <div className="flex items-center justify-between bg-white border border-vitalab-border rounded-xl p-1.5 px-3 h-12 shadow-sm">
                    <button 
                      onClick={() => onCapsChange(Math.max(10, caps - 10))}
                      className="w-8 h-8 rounded-lg hover:bg-vitalab-bg flex items-center justify-center text-vitalab-text-secondary"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono font-black text-sm">{caps}</span>
                    <button 
                      onClick={() => onCapsChange(Math.min(360, caps + 10))}
                      className="w-8 h-8 rounded-lg hover:bg-vitalab-bg flex items-center justify-center text-vitalab-text-secondary"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[0.65rem] font-black text-vitalab-text-muted uppercase tracking-widest block pl-1">Embalagem</span>
                  <select 
                    value={pharmaceuticalForm}
                    onChange={(e) => onFormChange(e.target.value)}
                    className="h-12 w-full bg-white border border-vitalab-border rounded-xl px-3 font-bold text-xs text-vitalab-text outline-none focus:ring-1 focus:ring-vitalab-green shadow-sm"
                  >
                    {forms.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {initialItems.length > 0 && (
                <div className="p-3 bg-vitalab-green/5 border border-vitalab-green/20 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[0.6rem] font-bold text-vitalab-green-text">
                       <span>Total em Ativos:</span>
                       <span>{fBRL(pricing.total - pricing.capsTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[0.6rem] font-bold text-vitalab-green-text">
                       <span>Embalagem + Cápsulas:</span>
                       <span>{fBRL(pricing.capsTotal)}</span>
                    </div>
                    <div className="pt-2 border-t border-vitalab-green/20 flex justify-between items-end">
                        <span className="text-[0.65rem] font-black text-vitalab-text uppercase">Valor Final</span>
                        <div className="text-xl font-black text-vitalab-green">{fBRL(pricing.total)}</div>
                    </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 pt-2 shrink-0">
               <div className="bg-white p-3 rounded-xl border border-vitalab-border flex gap-2.5 items-start w-full">
                  <AlertCircle size={14} className="text-vitalab-orange mt-0.5 shrink-0" />
                  <p className="text-[0.6rem] font-medium text-vitalab-text-secondary leading-relaxed">
                    Sua fórmula passará por uma revisão farmacêutica profissional antes da manipulação. O valor final pode sofrer alterações baseadas na compatibilidade técnica.
                  </p>
               </div>
            </DialogFooter>
          </div>
          </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
