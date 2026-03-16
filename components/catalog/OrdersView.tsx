"use client"

import { Button } from '@/components/ui/button';
import { fBRL } from '@/lib/utils';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, PackageCheck } from 'lucide-react';

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
  onBack: () => void;
}

const statusMap = {
  REVIEW: { label: 'Em revisão', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  APPROVED: { label: 'Aprovado', cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  ADJUSTMENT: { label: 'Ajuste solicitado', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle },
  COMPLETED: { label: 'Concluído', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: PackageCheck },
};

export const OrdersView = ({ orders, onBack }: OrdersViewProps) => {
  return (
    <div className="orders-view p-8 pt-6 max-w-4xl mx-auto overflow-y-auto h-full">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-vitalab-text-secondary">
          <ArrowLeft size={16} className="mr-1" />
          Voltar ao Catálogo
        </Button>
      </div>
      
      <h2 className="text-2xl font-extrabold text-vitalab-text mb-1">Meus Pedidos</h2>
      <p className="text-[0.83rem] text-vitalab-text-muted mb-8">Acompanhe o status e o retorno do farmacêutico</p>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border-[1.5px] border-vitalab-border rounded-vitalab-xl">
          <p className="text-vitalab-text-muted text-[0.85rem]">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const S = statusMap[o.status] || statusMap.REVIEW;
            return (
              <div key={o.id} className="ocard bg-white border-[1.5px] border-vitalab-border rounded-vitalab-lg p-5 transition-all hover:shadow-vitalab-s">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="oid font-mono text-[0.73rem] text-vitalab-text-muted">
                      {o.id} · {new Date(o.date).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-lg font-extrabold text-vitalab-text mt-1">{o.formulaName}</div>
                    <div className="text-[0.75rem] text-vitalab-text-muted mt-1">
                      {o.caps} un. · {o.form} · {o.partnerName}
                    </div>
                  </div>
                  <span className={`ostatus px-3 py-[0.22rem] rounded-[20px] text-[0.72rem] font-bold border flex items-center gap-1.5 ${S.cls}`}>
                    <S.icon size={12} />
                    {S.label}
                  </span>
                </div>
                
                <div className="text-[0.76rem] text-vitalab-text-muted mb-3 flex flex-wrap gap-x-2">
                  {o.items.map((i, idx) => (
                    <span key={idx}>
                      {i.ico || '💊'} {i.name} {i.dosePerCap}{i.unit}
                      {idx < o.items.length - 1 && ' + '}
                    </span>
                  ))}
                </div>
                
                <div className="mono text-[0.88rem] font-bold text-vitalab-orange">
                  {fBRL(o.total)}
                </div>
                
                {o.pharmacistNote && (
                  <div className={`onote mt-4 p-3 rounded-[8px] text-[0.8rem] border leading-relaxed ${o.status === 'ADJUSTMENT' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                    <span className="font-bold">{o.status === 'ADJUSTMENT' ? '⚠️' : '✅'} Farmacêutico:</span> {o.pharmacistNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
