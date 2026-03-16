"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { fBRL } from '@/lib/utils';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, PackageCheck, Plus, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Order {
  id: string;
  date: Date;
  formulaName: string;
  caps: number;
  form: string;
  partnerName: string;
  status: 'REVIEW' | 'APPROVED' | 'ADJUSTMENT' | 'COMPLETED';
  total: number;
  pharmacistNote?: string | null;
  items: any[];
}

interface OrdersViewProps {
  orders: Order[];
  onCreateOrder: () => void;
}

const statusConfig = {
  REVIEW: { label: 'Em Revisão', color: 'text-vitalab-orange', bg: 'bg-vitalab-orange/5', border: 'border-vitalab-orange/20', icon: Clock },
  APPROVED: { label: 'Aprovado', color: 'text-vitalab-green', bg: 'bg-vitalab-green/5', border: 'border-vitalab-green/20', icon: CheckCircle2 },
  ADJUSTMENT: { label: 'Ajuste Solicitado', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: AlertCircle },
  COMPLETED: { label: 'Concluído', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: PackageCheck },
};

export const OrdersView = ({ orders, onCreateOrder }: OrdersViewProps) => {
  const [mounted, setMounted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="orders-view p-8 pt-10 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-vitalab-text tracking-tight">Meus Pedidos</h2>
          <p className="text-[0.85rem] text-vitalab-text-secondary font-medium mt-1">Gerencie suas fórmulas e acompanhe as revisões farmacêuticas</p>
        </div>
        <Button 
          onClick={onCreateOrder}
          className="bg-vitalab-green hover:bg-vitalab-green-text text-white font-black px-8 h-12 shadow-vitalab-md rounded-xl gap-2 text-sm"
        >
          <Plus size={18} /> Novo Pedido
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white border border-dashed border-vitalab-border rounded-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-vitalab-bg rounded-full flex items-center justify-center mb-6 opacity-40">
            <PackageCheck size={32} className="text-vitalab-text-muted" />
          </div>
          <h3 className="text-lg font-black text-vitalab-text mb-2">Sem fórmulas por aqui</h3>
          <p className="text-vitalab-text-muted text-[0.85rem] max-w-sm mb-8">Role para baixo para ver como funciona ou comece sua primeira fórmula agora.</p>
          <Button 
            onClick={onCreateOrder}
            variant="outline"
            className="border-vitalab-green text-vitalab-green font-black h-10 px-6 hover:bg-vitalab-green/5"
          >
            Começar Agora
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((o) => {
            const S = statusConfig[o.status] || statusConfig.REVIEW;
            return (
              <Card 
                key={o.id} 
                className="group relative bg-white border-vitalab-border hover:border-vitalab-green/30 shadow-vitalab-sm hover:shadow-vitalab-md transition-all duration-300 cursor-pointer overflow-hidden p-0 rounded-2xl"
                onClick={() => setSelectedOrder(o)}
              >
                <div className={`h-1.5 w-full ${S.bg} border-b ${S.border}`} />
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[0.65rem] font-bold text-vitalab-text-muted uppercase tracking-widest opacity-70">
                        {mounted ? new Date(o.date).toLocaleDateString('pt-BR') : '...'} · #{o.id.slice(0, 8)}
                      </div>
                      <h4 className="text-lg font-black text-vitalab-text mt-2 group-hover:text-vitalab-green transition-colors leading-tight">
                        {o.formulaName}
                      </h4>
                    </div>
                    <div className={`p-2 rounded-xl border ${S.bg} ${S.border} ${S.color}`}>
                      <S.icon size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {o.items.slice(0, 3).map((item, idx) => (
                        <Badge key={idx} variant="outline" className="bg-vitalab-bg/50 border-vitalab-border text-vitalab-text-muted text-[0.6rem] font-bold py-0">
                          {item.name}
                        </Badge>
                      ))}
                      {o.items.length > 3 && (
                        <Badge variant="outline" className="bg-vitalab-bg/50 border-vitalab-border text-vitalab-text-muted text-[0.6rem] font-bold py-0">
                          +{o.items.length - 3} ativos
                        </Badge>
                      )}
                    </div>
                    <p className="text-[0.7rem] text-vitalab-text-muted font-medium">
                      {o.caps} un. de {o.form} · {o.partnerName}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-5 border-t border-dashed border-vitalab-border">
                    <div className="flex flex-col">
                      <span className="text-[0.6rem] font-black text-vitalab-text-muted uppercase tracking-wider">Status</span>
                      <span className={`text-[0.75rem] font-black ${S.color}`}>{S.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[0.6rem] font-black text-vitalab-text-muted uppercase tracking-wider block">Total</span>
                      <span className="text-[1.1rem] font-black text-vitalab-green">{fBRL(o.total)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-vitalab-green/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-3xl">
          {selectedOrder && (
            <div className="flex flex-col h-full bg-white">
              <div className="p-8 pb-6 border-b border-vitalab-border bg-vitalab-bg/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[0.7rem] font-black text-vitalab-text-muted uppercase tracking-widest mb-1 opacity-60">
                      Detalhes do Pedido · #{selectedOrder.id}
                    </div>
                    <DialogTitle className="text-3xl font-black text-vitalab-text">{selectedOrder.formulaName}</DialogTitle>
                    <DialogDescription className="sr-only">
                      Detalhes técnicos da fórmula, status da farmácia e composição.
                    </DialogDescription>
                  </div>
                  <Badge className={`${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].color} ${statusConfig[selectedOrder.status].border} border px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wide`}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-black text-vitalab-text-muted uppercase tracking-widest block opacity-60">Data</span>
                    <p className="text-sm font-bold text-vitalab-text">{mounted ? new Date(selectedOrder.date).toLocaleString() : '...'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-black text-vitalab-text-muted uppercase tracking-widest block opacity-60">Farmácia</span>
                    <p className="text-sm font-bold text-vitalab-text font-mono uppercase tracking-tight">{selectedOrder.partnerName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-black text-vitalab-text-muted uppercase tracking-widest block opacity-60">Formato</span>
                    <p className="text-sm font-bold text-vitalab-text">{selectedOrder.caps} un. · {selectedOrder.form}</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8 space-y-8 overflow-y-auto max-h-[60vh]">
                {selectedOrder.pharmacistNote && (
                  <div className={`p-5 rounded-2xl border flex gap-4 ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].border}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${statusConfig[selectedOrder.status].color} bg-white border ${statusConfig[selectedOrder.status].border}`}>
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${statusConfig[selectedOrder.status].color}`}>Nota do Farmacêutico</h4>
                      <p className="text-[0.85rem] font-medium text-vitalab-text-secondary leading-relaxed">{selectedOrder.pharmacistNote}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-[0.7rem] font-black text-vitalab-text-muted uppercase tracking-widest">Composição da Fórmula</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-vitalab-bg/30 rounded-xl border border-vitalab-border/50">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{it.ico || '💊'}</div>
                          <div>
                            <p className="text-sm font-bold text-vitalab-text">{it.name}</p>
                            <p className="text-[0.65rem] text-vitalab-text-muted font-bold uppercase tracking-wider">{it.dosePerCap}{it.unit} por cap</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-vitalab-text-muted">Subtotal</p>
                          <p className="text-sm font-black text-vitalab-orange">{fBRL(it.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-vitalab-bg/10 border-t border-vitalab-border flex justify-between items-center">
                <div>
                  <span className="text-[0.7rem] font-black text-vitalab-text-muted uppercase tracking-widest block mb-1">Valor Total do Pedido</span>
                  <div className="text-3xl font-black text-vitalab-green">{fBRL(selectedOrder.total)}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="font-black rounded-xl border-vitalab-border h-11 px-6 text-sm" onClick={() => setSelectedOrder(null)}>Fechar</Button>
                  <Button 
                    className="bg-vitalab-green hover:bg-vitalab-green-text text-white font-black rounded-xl h-11 px-8 text-sm shadow-vitalab-md"
                    onClick={() => window.print()}
                  >
                     Imprimir
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
