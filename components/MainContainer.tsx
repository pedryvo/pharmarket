"use client"

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { OrdersView } from '@/components/catalog/OrdersView';
import { FormulaCreationModal } from '@/components/catalog/FormulaCreationModal';
import { PricingService } from '@/services/pricing.service';
import { logoutAction } from '@/app/actions/auth';
import { createOrderAction, getClientOrdersAction } from '@/app/actions/order';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2, MessageSquare } from 'lucide-react';

interface MainContainerProps {
  initialData: {
    products: any[];
    categories: any[];
    partners: any[];
    settings: any;
  };
  currentUser: any;
}

export const MainContainer = ({ initialData, currentUser }: MainContainerProps) => {
  const [view, setView] = useState<'catalog' | 'orders'>('orders');
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formulaName, setFormulaName] = useState('');
  const [caps, setCaps] = useState(30);
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | undefined>(undefined);
  const [pharmaceuticalForm, setPharmaceuticalForm] = useState(initialData.settings?.forms[0] || 'Cápsula');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const globalFactor = initialData.settings?.factor || 3.5;
  const capCost = initialData.settings?.capCost || 0.05;

  const handleLogout = async () => {
    await logoutAction();
  };

  const fetchOrders = async () => {
    try {
      const res = await getClientOrdersAction();
      setOrders(res);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [view]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!formulaName.trim()) {
      toast.error('Dê um nome para sua fórmula');
      return;
    }

    try {
      await createOrderAction({
        formulaName,
        form: pharmaceuticalForm,
        caps,
        partnerId: selectedPartnerId!,
        items: cartItems.map(it => ({
          productId: it.productId,
          dosePerCap: it.dosePerCap
        }))
      });
      
      toast.success('Pedido enviado com sucesso!');
      setCartItems([]);
      setFormulaName('');
      setIsFormulaModalOpen(false);
      setShowSuccessModal(true);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar pedido');
    }
  };

  const handleAddItem = (productId: number) => {
    const product = initialData.products.find(p => p.id === productId);
    if (!product) return;
    
    if (cartItems.find(it => it.productId === productId)) {
      return;
    }

    const defaultDose = product.doses[0] || 500;
    const calc = PricingService.calculateItem(product.cpg, product.factor, globalFactor, defaultDose, caps, product.unit);
    
    const newItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      ico: product.ico,
      dosePerCap: defaultDose,
      unit: product.unit,
      cpg: product.cpg,
      factor: product.factor,
      price: calc.price,
      rawCost: calc.raw
    };
    
    setCartItems([...cartItems, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(it => it.id !== id));
  };

  const handleDoseChange = (id: number, dose: number) => {
    setCartItems(cartItems.map(it => {
      if (it.id === id) {
        const calc = PricingService.calculateItem(it.cpg, it.factor, globalFactor, dose, caps, it.unit);
        return { ...it, dosePerCap: dose, price: calc.price, rawCost: calc.raw };
      }
      return it;
    }));
  };

  // Recalculate all items when caps change
  useEffect(() => {
    setCartItems(prev => prev.map(it => {
      const calc = PricingService.calculateItem(it.cpg, it.factor, globalFactor, it.dosePerCap, caps, it.unit);
      return { ...it, price: calc.price, rawCost: calc.raw };
    }));
  }, [caps, globalFactor]);

  const pricing = useMemo(() => {
    return PricingService.calculateOrder(cartItems, caps, globalFactor, capCost);
  }, [cartItems, caps, globalFactor, capCost]);

  return (
    <div className="flex flex-col min-h-screen bg-vitalab-bg">
      <Navbar 
        user={currentUser} 
        cartCount={cartItems.length}
        onLogoClick={() => setView('catalog')}
        onLogout={handleLogout}
      />
      
      <main className="flex flex-1 relative bg-vitalab-bg/50">
        <div className="flex-1">
          <OrdersView 
            orders={orders.map(o => ({
              ...o,
              partnerName: o.partner?.name || 'Parceira'
            }))}
            onCreateOrder={() => setIsFormulaModalOpen(true)}
          />
        </div>
      </main>

      <FormulaCreationModal 
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        products={initialData.products}
        categories={initialData.categories}
        forms={initialData.settings?.forms || []}
        initialItems={cartItems}
        onAddItem={handleAddItem}
        onRemoveItem={(id) => handleRemoveItem(id)}
        onDoseChange={(id, dose) => handleDoseChange(id, dose)}
        onCapsChange={setCaps}
        onFormChange={setPharmaceuticalForm}
        onFormulaNameChange={setFormulaName}
        onSubmit={handleCheckout}
        formulaName={formulaName}
        caps={caps}
        pharmaceuticalForm={pharmaceuticalForm}
        pricing={pricing}
        partners={initialData.partners}
        selectedPartnerId={selectedPartnerId}
        onPartnerChange={(id) => {
          setSelectedPartnerId(id);
          setCartItems([]); // Clear cart when pharmacy changes
          toast.info('Catálogo atualizado para a farmácia selecionada');
        }}
      />

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-white border-vitalab-border rounded-2xl overflow-hidden p-0">
          <DialogHeader className="flex flex-col items-center justify-center pt-8 px-6">
            <div className="w-14 h-14 bg-vitalab-green/10 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-8 h-8 text-vitalab-green" />
            </div>
            <DialogTitle className="text-xl font-black text-vitalab-text text-center">Fórmula Solicitada!</DialogTitle>
            <DialogDescription className="text-center text-vitalab-text-muted mt-1 text-[0.8rem] font-medium leading-relaxed">
              Seu pedido foi enviado com sucesso para a farmácia parceira.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-2">
            <div className="bg-vitalab-bg/50 p-5 rounded-xl border border-vitalab-border space-y-4 my-2">
              <div className="flex items-start gap-3">
                <div className="bg-vitalab-green text-white p-1 rounded-full mt-0.5 shrink-0">
                  <CheckCircle2 size={12} />
                </div>
                <div>
                  <p className="font-black text-vitalab-text text-[0.8rem] uppercase tracking-wide">Próximo Passo: Revisão</p>
                  <p className="text-[0.7rem] text-vitalab-text-secondary font-medium mt-0.5">Um farmacêutico irá revisar sua composição agora mesmo.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-[#25D366] text-white p-1 rounded-full mt-0.5 shrink-0">
                  <MessageSquare size={12} />
                </div>
                <div>
                  <p className="font-black text-vitalab-text text-[0.8rem] uppercase tracking-wide">Contato via WhatsApp</p>
                  <p className="text-[0.7rem] text-vitalab-text-secondary font-medium mt-0.5">Você receberá uma mensagem assim que o pedido for aprovado.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2">
            <Button 
              className="w-full bg-vitalab-green hover:bg-vitalab-green-text text-white font-black h-10 shadow-vitalab-md rounded-xl text-sm"
              onClick={() => setShowSuccessModal(false)}
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
