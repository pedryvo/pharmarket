"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fBRL } from '@/lib/utils';
import { Check, X, AlertCircle, MessageSquare } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  formulaName: string;
  total: number;
  items: any[];
  status: string;
}

export const PharmacistDashboard = ({ initialOrders }: { initialOrders: Order[] }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeNote, setActiveNote] = useState<Record<string, string>>({});

  const handleReview = (id: string, status: 'APPROVED' | 'ADJUSTMENT') => {
    console.log(`Reviewing order ${id} as ${status} with note: ${activeNote[id]}`);
    // In real app, call OrderService via server action
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <div className="pharmacist-dash p-8 pt-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-extrabold text-vitalab-text mb-1">Painel do Farmacêutico</h2>
      <p className="text-[0.83rem] text-vitalab-text-muted mb-8">Revise e aprove as solicitações de fórmulas manipuladas</p>

      {orders.length === 0 ? (
        <div className="bg-white border-[1.5px] border-vitalab-border rounded-vitalab-xl p-10 text-center">
          <p className="text-vitalab-text-muted">Sem solicitações pendentes no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.map((o) => (
            <div key={o.id} className="pcard bg-white border-[1.5px] border-vitalab-border rounded-vitalab-lg p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-mono text-[0.7rem] text-vitalab-text-muted">{o.id}</div>
                  <div className="text-md font-bold text-vitalab-text">{o.formulaName}</div>
                  <div className="text-[0.78rem] text-vitalab-green font-semibold">Portador: {o.clientName}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-vitalab-orange">{fBRL(o.total)}</div>
                </div>
              </div>

              <div className="bg-vitalab-bg rounded-[8px] p-3 mb-4 space-y-2">
                {o.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[0.78rem]">
                    <span className="text-vitalab-text font-medium">{i.ico || '💊'} {i.name}</span>
                    <span className="font-mono text-vitalab-text-secondary">{i.dosePerCap}{i.unit}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-2.5 text-vitalab-text-muted" />
                  <Input 
                    placeholder="Nota do farmacêutico / motivo de ajuste..."
                    className="pl-8 text-[0.8rem]"
                    value={activeNote[o.id] || ''}
                    onChange={(e) => setActiveNote({ ...activeNote, [o.id]: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleReview(o.id, 'ADJUSTMENT')}
                  >
                    <AlertCircle size={16} className="mr-1" /> Ajuste
                  </Button>
                  <Button 
                    className="flex-1 bg-vitalab-green text-white hover:bg-vitalab-green/90"
                    onClick={() => handleReview(o.id, 'APPROVED')}
                  >
                    <Check size={16} className="mr-1" /> Aprovar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
