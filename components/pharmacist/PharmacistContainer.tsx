"use client"

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ClipboardList, 
  RotateCcw, 
  CheckCircle2, 
  DollarSign, 
  MessageSquare, 
  Printer,
  ChevronRight,
  Clock,
  ExternalLink,
  Beaker,
  BarChart3
} from 'lucide-react';
import { fBRL, fG } from '@/lib/utils';
import { updateOrderStatusAction } from '@/app/actions/admin';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PharmacistContainerProps {
  currentUser: any;
  initialOrders: any[];
}

export const PharmacistContainer = ({ currentUser, initialOrders }: PharmacistContainerProps) => {
  const [orders, setOrders] = useState(initialOrders);
  const [note, setNote] = useState('');
  const [mounted, setMounted] = useState(false);
  const [summaryOrder, setSummaryOrder] = useState<any>(null);
  const [waOrder, setWaOrder] = useState<any>(null);
  const [contactedOrders, setContactedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyWA = async (order: any) => {
    const msg = generateWAMessage(order);
    try {
      await navigator.clipboard.writeText(msg);
      setContactedOrders(prev => new Set(prev).add(order.id));
      toast.success('Mensagem copiada para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar mensagem');
    }
  };

  const generateWAMessage = (o: any) => {
    if (!o) return '';
    const comp = o.items?.map((i: any) => `  ${i.ico || '•'} ${i.name} — ${i.dosePerCap}${i.unit}/cáps (${fG(i.dosePerCap * o.caps)} total)`).join('\n');
    
    let msg = '';
    const partnerName = o.partner?.name || 'VitaLab';
    const clientName = o.client?.name || 'Cliente';

    if (o.status === 'APPROVED') {
      msg = `✅ *VitaLab — ${partnerName}*\n\nOlá, *${clientName}*! 👋\n\nSua fórmula *${o.formulaName}* foi *APROVADA*! 🎉\n\n📋 *Composição:*\n${comp}\n\n🔹 ${o.caps} unidades · ${o.form || 'Cápsula'}\n💰 *Total: ${fBRL(o.total)}*\n\n${o.pharmacistNote ? `💬 _"${o.pharmacistNote}"_\n\n` : ''}Em breve entraremos em contato para confirmar prazo e pagamento.\n\nObrigado pela confiança! 🌿`;
    } else if (o.status === 'ADJUSTMENT') {
      msg = `⚠️ *VitaLab — ${partnerName}*\n\nOlá, *${clientName}*!\n\nNosso farmacêutico analisou sua fórmula *${o.formulaName}* e solicita *ajustes*.\n\n💬 *Observação:*\n_"${o.pharmacistNote || note}"_\n\n📋 *Composição atual:*\n${comp}\n\nAcesse o app para solicitar uma nova fórmula ou entre em contato conosco. 💊`;
    } else if (o.status === 'REVIEW') {
      msg = `🔬 *VitaLab — ${partnerName}*\n\nOlá, *${clientName}*!\n\nRecebemos sua fórmula *${o.formulaName}* com ${o.items?.length || 0} ativo(s) para ${o.caps} unidades. ✓\n\nEm *revisão farmacêutica*. ⏳\n\nVocê será notificado assim que a análise for concluída.\n\nObrigado pela preferência! 🌱`;
    } else {
      const statusLabel = o.status === 'COMPLETED' ? 'CONCLUÍDO' : o.status;
      msg = `*VitaLab — ${partnerName}*\n\nOlá, *${clientName}*!\n\n*${o.formulaName}* — ${statusLabel}\n\nObrigado! 🌿`;
    }
    return msg;
  };

  const stats = {
    pending: orders.filter(o => o.status === 'REVIEW').length,
    revised: orders.filter(o => o.status === 'ADJUSTMENT').length,
    approved: orders.filter(o => o.status === 'APPROVED' || o.status === 'COMPLETED').length,
    billing: orders.reduce((acc, o) => acc + ((o.status === 'APPROVED' || o.status === 'COMPLETED') ? o.total : 0), 0)
  };

  const pendingOrders = orders.filter(o => o.status === 'REVIEW');
  const historyOrders = orders.filter(o => o.status !== 'REVIEW').slice(0, 10);

  const handleAction = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusAction(orderId, status as any, note);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      setNote('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-vitalab-bg flex flex-col font-sans">
      <Navbar 
        user={currentUser} 
        cartCount={0}
        onLogoClick={() => {}}
        onLogout={async () => {
          const { logoutAction } = await import('@/app/actions/auth');
          await logoutAction();
        }}
      />

      <main className="flex-1 px-10 py-8 w-full space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-xl font-black text-vitalab-text mb-0.5">Painel do Farmacêutico</h1>
            <p className="text-vitalab-text-muted text-[0.78rem]">Revise e aprove as fórmulas solicitadas pelos clientes.</p>
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="font-bold text-vitalab-text-muted"><RotateCcw size={16} className="mr-2"/> Atualizar</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border-vitalab-border shadow-vitalab-sm hover:border-vitalab-orange/30 transition-all">
            <div className="flex items-center gap-3 text-vitalab-orange mb-2">
              <Clock size={16} />
              <span className="text-[0.6rem] font-black uppercase tracking-widest">Em revisão</span>
            </div>
            <div className="text-2xl font-black text-vitalab-text">{stats.pending}</div>
          </Card>
          <Card className="p-6 bg-white border-vitalab-border shadow-vitalab-sm hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3 text-blue-500 mb-2">
              <RotateCcw size={16} />
              <span className="text-[0.6rem] font-black uppercase tracking-widest">Ajuste Solicitado</span>
            </div>
            <div className="text-2xl font-black text-vitalab-text">{stats.revised}</div>
          </Card>
          <Card className="p-6 bg-white border-vitalab-border shadow-vitalab-sm hover:border-vitalab-green/30 transition-all">
            <div className="flex items-center gap-3 text-vitalab-green mb-2">
              <CheckCircle2 size={16} />
              <span className="text-[0.6rem] font-black uppercase tracking-widest">Aprovados</span>
            </div>
            <div className="text-2xl font-black text-vitalab-text">{stats.approved}</div>
          </Card>
          <Card className="p-6 bg-white border-vitalab-border shadow-vitalab-sm hover:border-vitalab-green-text/30 transition-all">
            <div className="flex items-center gap-3 text-vitalab-green-text mb-2">
              <DollarSign size={16} />
              <span className="text-[0.6rem] font-black uppercase tracking-widest">Faturamento</span>
            </div>
            <div className="text-2xl font-black text-vitalab-text">{fBRL(stats.billing)}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waiting Review Container */}
          <Card className="flex flex-col bg-white border-vitalab-border shadow-vitalab-md overflow-hidden min-h-[600px]">
            <div className="p-5 border-b border-vitalab-border bg-vitalab-bg/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-vitalab-orange/10 flex items-center justify-center text-vitalab-orange">
                  <Clock size={18} />
                </div>
                <div>
                  <h2 className="text-[0.85rem] font-black text-vitalab-text uppercase tracking-wider">Aguardando Revisão</h2>
                  <p className="text-[0.65rem] text-vitalab-text-secondary font-medium">Pedidos pendentes de análise técnica</p>
                </div>
              </div>
              <Badge className="bg-vitalab-orange text-white font-black text-[0.65rem] rounded-full px-2 py-0.5">
                {pendingOrders.length}
              </Badge>
            </div>

            <div className="flex-1 p-5 space-y-4 bg-vitalab-bg/20 overflow-y-auto max-h-[800px]">
              {pendingOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-vitalab-text-muted">
                  <Beaker size={40} className="mb-4 opacity-10" />
                  <p className="text-[0.75rem] font-medium">Nenhum pedido pendente</p>
                </div>
              ) : (
                pendingOrders.map(order => (
                  <Card key={order.id} className="bg-white border-vitalab-border hover:border-vitalab-orange/30 shadow-vitalab-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-black text-vitalab-text text-[0.8rem]">{order.client?.name || 'Cliente'}</div>
                          <div className="text-sm font-black text-vitalab-green">{order.formulaName}</div>
                          <div className="text-[0.65rem] text-vitalab-text-muted mt-1 uppercase tracking-wider font-bold">
                            {order.id} · {mounted ? new Date(order.date).toLocaleString() : '...'} · {order.caps} un
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="bg-vitalab-orange/5 text-vitalab-orange border-vitalab-orange/20 font-black text-[0.6rem] px-1.5 py-0">
                            Pendente
                          </Badge>
                          {contactedOrders.has(order.id) && (
                            <div className="text-[0.6rem] font-black text-vitalab-green flex items-center gap-1">
                              <CheckCircle2 size={10} /> CONTACTADO
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-1.5 font-black text-vitalab-text border-t border-dashed border-vitalab-border bg-vitalab-bg/30 -mx-5 px-5">
                        <span className="text-[0.65rem] uppercase tracking-wider text-vitalab-text-muted">Total</span>
                        <span className="text-[0.9rem] font-black text-vitalab-green">{fBRL(order.total)}</span>
                      </div>

                      <div className="space-y-3">
                         <Textarea 
                          placeholder="Observação para o cliente..."
                          className="bg-vitalab-bg border-vitalab-border focus:bg-white min-h-[60px] text-[0.75rem] rounded-lg p-3"
                          value={note}
                          onChange={e => setNote(e.target.value)}
                         />
                         <div className="grid grid-cols-2 gap-2">
                            <Button 
                              className="bg-vitalab-green hover:bg-vitalab-green-text text-white font-black h-9 text-[0.75rem] rounded-lg shadow-vitalab-sm"
                              onClick={() => handleAction(order.id, 'APPROVED')}
                            >
                              ✓ Aprovar
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-blue-100 text-blue-600 hover:bg-blue-50 font-black h-9 text-[0.75rem] rounded-lg"
                              onClick={() => handleAction(order.id, 'ADJUSTMENT')}
                            >
                              Revisar
                            </Button>
                         </div>
                         <div className="flex gap-1.5 pt-1 border-t border-dashed border-vitalab-border">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green font-bold text-[0.6rem] h-8 px-2"
                                onClick={() => setSummaryOrder(order)}
                              >
                                <ClipboardList size={14} className="mr-1.5"/> RESUMO
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green font-bold text-[0.6rem] h-8 px-2"
                                onClick={() => setWaOrder(order)}
                              >
                                <MessageSquare size={14} className="mr-1.5"/> WHATSAPP
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 shrink-0 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green"
                              >
                                <Printer size={14}/>
                              </Button>
                         </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>

          {/* History Container */}
          <Card className="flex flex-col bg-white border-vitalab-border shadow-vitalab-md overflow-hidden min-h-[600px]">
            <div className="p-5 border-b border-vitalab-border bg-vitalab-bg/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-vitalab-green/10 flex items-center justify-center text-vitalab-green">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h2 className="text-[0.85rem] font-black text-vitalab-text uppercase tracking-wider">Histórico</h2>
                  <p className="text-[0.65rem] text-vitalab-text-secondary font-medium">Pedidos processados recentemente</p>
                </div>
              </div>
              <Badge className="bg-vitalab-green text-white font-black text-[0.65rem] rounded-full px-2 py-0.5">
                {historyOrders.length}
              </Badge>
            </div>

            <div className="flex-1 p-5 space-y-3 bg-vitalab-bg/20 overflow-y-auto max-h-[800px]">
              {historyOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-vitalab-text-muted">
                  <div className="text-2xl opacity-10 mb-2">📋</div>
                  <p className="text-[0.75rem] font-medium">Histórico vazio</p>
                </div>
              ) : (
                historyOrders.map(order => (
                  <Card key={order.id} className="p-4 bg-white border-vitalab-border shadow-sm hover:border-vitalab-green/30 transition-all group">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[0.85rem] text-vitalab-text group-hover:text-vitalab-green transition-colors">{order.formulaName}</div>
                        <div className="text-[0.65rem] text-vitalab-text-muted font-bold mt-0.5">
                          {order.client?.name} · {order.id} · {mounted ? new Date(order.date).toLocaleDateString() : '...'}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`text-[0.6rem] px-1.5 py-0 font-black ${
                          order.status === 'APPROVED' ? 'bg-vitalab-green/5 text-vitalab-green border-vitalab-green/10' : 'bg-vitalab-bg text-vitalab-text-muted border-vitalab-border'
                        }`}>
                          {order.status}
                        </Badge>
                        <div className="font-mono font-bold text-vitalab-orange text-[0.75rem] mt-1">{fBRL(order.total)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green font-bold text-[0.6rem] h-7 px-2"
                        onClick={() => setSummaryOrder(order)}
                      >
                        <ExternalLink size={12} className="mr-1.5"/> DETALHES
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green font-bold text-[0.6rem] h-7 px-2"
                        onClick={() => setWaOrder(order)}
                      >
                        <MessageSquare size={12} className="mr-1.5"/> WHATSAPP
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Summary Modal */}
      <Dialog open={!!summaryOrder} onOpenChange={(open) => !open && setSummaryOrder(null)}>
        <DialogContent className="max-w-6xl w-[95vw] p-10 overflow-visible">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="text-vitalab-green" />
              Resumo da Fórmula
            </DialogTitle>
            <DialogDescription className="sr-only">
              Visão detalhada dos componentes, custos e status da fórmula.
            </DialogDescription>
          </DialogHeader>
          {summaryOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-vitalab-bg rounded-vitalab-lg border border-vitalab-border text-[0.8rem]">
                <div><span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.65rem]">Pedido:</span> <span className="font-mono font-bold text-vitalab-text">{summaryOrder.id}</span></div>
                <div><span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.65rem]">Data:</span> <span className="font-bold text-vitalab-text">{new Date(summaryOrder.date).toLocaleString()}</span></div>
                <div><span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.65rem]">Cliente:</span> <span className="font-bold text-vitalab-text">{summaryOrder.client?.name}</span></div>
                <div><span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.65rem]">WhatsApp:</span> <span className="font-bold text-vitalab-text">{summaryOrder.client?.phone}</span></div>
                <div><span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.65rem]">Fórmula:</span> <span className="font-bold text-vitalab-green">{summaryOrder.formulaName}</span></div>
                <div><span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.6rem]">Farmácia:</span> <span className="font-bold text-vitalab-text">{summaryOrder.partner?.name}</span></div>
                <div><span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.6rem]">Unidades:</span> <span className="font-bold text-vitalab-text">{summaryOrder.caps} · {summaryOrder.form || 'Cápsula'}</span></div>
                <div>
                  <span className="text-vitalab-text-muted mr-2 font-bold uppercase text-[0.6rem]">Status:</span>
                  <Badge className={`text-[0.65rem] px-2 py-0 h-5 font-bold ${
                    summaryOrder.status === 'APPROVED' ? 'bg-vitalab-green/10 text-vitalab-green border-vitalab-green/20' : 
                    summaryOrder.status === 'ADJUSTMENT' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                    summaryOrder.status === 'COMPLETED' ? 'bg-vitalab-green text-white' :
                    'bg-vitalab-orange/10 text-vitalab-orange border-vitalab-orange/20'
                  }`}>
                    {summaryOrder.status}
                  </Badge>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-vitalab-bg/50">
                    <TableHead className="font-bold text-vitalab-text uppercase text-[0.6rem]">Ativo</TableHead>
                    <TableHead className="font-bold text-vitalab-text uppercase text-[0.6rem]">Dose/Cáps</TableHead>
                    <TableHead className="font-bold text-vitalab-text uppercase text-[0.6rem]">MP Total</TableHead>
                    <TableHead className="font-bold text-vitalab-text uppercase text-[0.6rem] text-right">Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryOrder.items?.map((it: any) => (
                    <TableRow key={it.id}>
                      <TableCell className="font-bold text-vitalab-text py-1.5 text-[0.8rem]">{it.name}</TableCell>
                      <TableCell className="text-vitalab-text-muted py-1.5 text-[0.8rem]">{it.dosePerCap}{it.unit}</TableCell>
                      <TableCell className="text-vitalab-text-muted py-1.5 text-[0.8rem]">{fG(it.dosePerCap * summaryOrder.caps)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-vitalab-orange py-1.5 text-[0.8rem]">{fBRL(it.price)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-vitalab-bg/30">
                    <TableCell colSpan={3} className="text-vitalab-text-muted font-bold text-[0.65rem] py-2">EMBALAGEM ({summaryOrder.caps} un.)</TableCell>
                    <TableCell className="text-right font-mono font-bold text-vitalab-orange py-2 text-[0.8rem]">{fBRL(summaryOrder.capsTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex justify-between items-center p-4 bg-vitalab-green/5 border border-vitalab-green/20 rounded-vitalab-lg">
                <span className="font-black text-vitalab-text uppercase tracking-widest text-[0.65rem]">Total da Fórmula</span>
                <span className="text-xl font-black text-vitalab-green">{fBRL(summaryOrder.total)}</span>
              </div>

              {summaryOrder.obs && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-vitalab-lg text-sm">
                  <div className="flex items-center gap-2 text-blue-700 font-bold mb-1 uppercase text-[0.6rem]">
                    <MessageSquare size={12} /> Observações do Cliente
                  </div>
                  <p className="text-blue-900 leading-relaxed">{summaryOrder.obs}</p>
                </div>
              )}

              {summaryOrder.pharmacistNote && (
                <div className="p-4 bg-vitalab-green/5 border border-vitalab-green/10 rounded-vitalab-lg text-sm">
                  <div className="flex items-center gap-2 text-vitalab-green-text font-bold mb-1 uppercase text-[0.6rem]">
                    <CheckCircle2 size={12} /> Retorno do Farmacêutico
                  </div>
                  <p className="text-vitalab-text leading-relaxed">{summaryOrder.pharmacistNote}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="gap-2 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green"
                  onClick={() => {
                    const waOrderToOpen = summaryOrder;
                    setSummaryOrder(null);
                    setWaOrder(waOrderToOpen);
                  }}
                >
                  <MessageSquare size={16} /> Abrir Preview WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* WhatsApp Modal */}
      <Dialog open={!!waOrder} onOpenChange={(open) => !open && setWaOrder(null)}>
        <DialogContent 
          showCloseButton={false}
          className="bg-transparent border-none shadow-none ring-0 p-0 max-w-lg w-full flex flex-col items-center"
          overlayClassName="bg-white/70 backdrop-blur-sm"
        >
          <DialogTitle className="sr-only">Preview da Mensagem WhatsApp</DialogTitle>
          <DialogDescription className="sr-only">
            Visualize como a mensagem de status aparecerá no WhatsApp do cliente.
          </DialogDescription>
          <div className="w-full max-w-[380px] space-y-6">
            <div className="bg-[#e9fbe9] border border-[#c3e6c3] rounded-[24px] overflow-hidden shadow-vitalab-l animate-in zoom-in-95 duration-300">
              <div className="bg-[#075e54] p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-base">
                  ⚗
                </div>
                <div>
                  <div className="text-white font-bold text-[0.8rem]">VitaLab — Farmácia</div>
                  <div className="text-white/70 text-[0.6rem]">online</div>
                </div>
              </div>
              <div className="p-5 bg-[#e5ddd5] relative">
                <div className="bg-white rounded-tr-lg rounded-b-lg p-3 text-[0.7rem] shadow-sm relative text-vitalab-text whitespace-pre-wrap leading-relaxed max-w-[92%]">
                  {generateWAMessage(waOrder)}
                  <div className="text-[0.6rem] text-right text-vitalab-text-muted mt-2 opacity-50 font-mono">
                    {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </div>
                  <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button 
                className="flex-1 bg-vitalab-green hover:bg-vitalab-green-text text-white font-black h-11 rounded-full shadow-vitalab-md"
                onClick={() => handleCopyWA(waOrder)}
              >
                Copiar Mensagem
              </Button>
              <Button 
                variant="outline"
                className="flex-1 font-black h-11 rounded-full bg-white border-vitalab-border hover:bg-vitalab-bg"
                onClick={() => setWaOrder(null)}
              >
                Sair
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
