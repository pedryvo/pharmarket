"use client"

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CatalogScreen } from '@/components/catalog/CatalogScreen';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { OrdersView } from '@/components/catalog/OrdersView';
import { PricingService } from '@/services/pricing.service';
import { Button } from '@/components/ui/button';

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
  const [view, setView] = useState<'catalog' | 'orders'>('catalog');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formulaName, setFormulaName] = useState('');
  const [caps, setCaps] = useState(30);
  const [pharmaceuticalForm, setPharmaceuticalForm] = useState(initialData.settings?.forms[0] || 'Cápsula');
  
  const globalFactor = initialData.settings?.factor || 3.5;
  const capCost = initialData.settings?.capCost || 0.05;

  const handleAddItem = (productId: number) => {
    const product = initialData.products.find(p => p.id === productId);
    if (!product) return;
    
    if (cartItems.find(it => it.productId === productId)) {
      return;
    }

    const defaultDose = product.doses[0] || 500;
    const calc = PricingService.calculateItem(product.cpg, product.factor, globalFactor, defaultDose, caps);
    
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
        const calc = PricingService.calculateItem(it.cpg, it.factor, globalFactor, dose, caps);
        return { ...it, dosePerCap: dose, price: calc.price, rawCost: calc.raw };
      }
      return it;
    }));
  };

  // Recalculate all items when caps change
  useEffect(() => {
    setCartItems(prev => prev.map(it => {
      const calc = PricingService.calculateItem(it.cpg, it.factor, globalFactor, it.dosePerCap, caps);
      return { ...it, price: calc.price, rawCost: calc.raw };
    }));
  }, [caps, globalFactor]);

  const pricing = useMemo(() => {
    return PricingService.calculateOrder(cartItems, caps, globalFactor, capCost);
  }, [cartItems, caps, globalFactor, capCost]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-vitalab-bg">
      <Navbar 
        user={currentUser} 
        cartCount={cartItems.length}
        onViewOrders={() => setView('orders')}
      />
      
      <main className="flex flex-1 overflow-hidden">
        {view === 'catalog' ? (
          <CatalogScreen 
            initialProducts={initialData.products}
            initialCategories={initialData.categories}
            partners={initialData.partners}
            onAddItem={handleAddItem}
            cartProductIds={cartItems.map(it => it.productId)}
          />
        ) : (
          <OrdersView 
            orders={[]} // In real app, fetch these from OrdersService
            onBack={() => setView('catalog')}
          />
        )}
        
        <CartSidebar 
          items={cartItems}
          formulaName={formulaName}
          onFormulaNameChange={setFormulaName}
          caps={caps}
          onCapsChange={setCaps}
          pharmaceuticalForm={pharmaceuticalForm}
          onFormChange={setPharmaceuticalForm}
          forms={initialData.settings?.forms || []}
          onRemoveItem={handleRemoveItem}
          onDoseChange={handleDoseChange}
          onCheckout={() => console.log('Checkout')}
          total={pricing.total}
          capsTotal={pricing.capsTotal}
        />
      </main>
    </div>
  );
};
