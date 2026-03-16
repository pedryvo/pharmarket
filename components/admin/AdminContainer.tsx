"use client"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { 
  LayoutDashboard, Users, Package, Settings, ArrowLeft, 
  Search, Edit2, Trash2, Check, X, Tag, Percent, DollarSign,
  Plus, Building2, ShoppingBag, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { 
  updateProductAction, 
  deleteProductAction, 
  createProductAction,
  updateCategoryAction, 
  createCategoryAction,
  deleteCategoryAction,
  updateSettingsAction,
  createPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
  updateOrderStatusAction
} from '@/app/actions/admin';

interface AdminContainerProps {
  session: any;
  initialData: {
    products: any[];
    categories: any[];
    settings: any;
    users: any[];
    partners: any[];
    orders: any[];
  };
}

type Tab = 'dashboard' | 'products' | 'categories' | 'users' | 'settings' | 'partners' | 'orders';

export function AdminContainer({ session, initialData }: AdminContainerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newValues, setNewValues] = useState<any>({});

  const handleLogout = async () => {
    await logoutAction();
  };

  const startEdit = (id: string | number, currentValues: any) => {
    setEditingId(id);
    setEditValues(currentValues);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveProduct = async (id: number) => {
    try {
      await updateProductAction(id, {
        cpg: parseFloat(editValues.cpg),
        factor: editValues.factor ? parseFloat(editValues.factor) : null,
        active: editValues.active,
        name: editValues.name,
        unit: editValues.unit,
        desc: editValues.desc,
        ico: editValues.ico,
        doses: editValues.dosesRaw ? editValues.dosesRaw.split(',').map((d: string) => parseFloat(d.trim())).filter((d: number) => !isNaN(d)) : []
      });
      setEditingId(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const saveCategory = async (id: string) => {
    try {
      await updateCategoryAction(id, {
        label: editValues.label,
        ico: editValues.ico
      });
      setEditingId(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const saveSettings = async () => {
    try {
      await updateSettingsAction({
        factor: parseFloat(editValues.factor),
        capCost: parseFloat(editValues.capCost),
        name: editValues.name,
        wa: editValues.wa,
        forms: editValues.formsRaw ? editValues.formsRaw.split('\n').map((f: string) => f.trim()).filter(Boolean) : []
      });
      setEditingId(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const savePartner = async (id: number) => {
    try {
      await updatePartnerAction(id, {
        name: editValues.name,
        city: editValues.city,
        wa: editValues.wa,
        rt: editValues.rt,
        active: editValues.active,
        specs: editValues.specsRaw ? editValues.specsRaw.split(',').map((s: string) => s.trim()).filter(Boolean) : []
      });
      setEditingId(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleCreate = async () => {
    try {
      if (activeTab === 'products') {
        await createProductAction({
          name: newValues.name,
          cpg: parseFloat(newValues.cpg),
          categoryId: newValues.categoryId,
          unit: newValues.unit,
          ico: newValues.ico || '🧪'
        });
      } else if (activeTab === 'categories') {
        await createCategoryAction({
          id: newValues.id,
          label: newValues.label,
          ico: newValues.ico || '📁'
        });
      } else if (activeTab === 'partners') {
        await createPartnerAction({
          name: newValues.name,
          city: newValues.city,
          wa: newValues.wa
        });
      }
      setShowCreateModal(false);
      setNewValues({});
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-vitalab-bg flex flex-col">
      <Navbar 
        user={session} 
        cartCount={0}
        onLogoClick={() => {}}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 max-w-7xl mx-auto w-full p-8 gap-8">
        {/* Sidebar Nav */}
        <aside className="w-64 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'products', label: 'Produtos', icon: <Package size={18} /> },
            { id: 'categories', label: 'Categorias', icon: <Tag size={18} /> },
            { id: 'partners', label: 'Farmácias', icon: <Building2 size={18} /> },
            { id: 'orders', label: 'Pedidos', icon: <ShoppingBag size={18} /> },
            { id: 'users', label: 'Usuários', icon: <Users size={18} /> },
            { id: 'settings', label: 'Configurações', icon: <Settings size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-vitalab-lg font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-vitalab-green text-white shadow-vitalab-md' 
                  : 'text-vitalab-text-muted hover:bg-vitalab-green/5 hover:text-vitalab-green'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black text-vitalab-text tracking-tight capitalize">
                {activeTab === 'dashboard' ? 'Visão Geral' : activeTab}
              </h1>
              <p className="text-vitalab-text-muted text-sm mt-1">
                {activeTab === 'dashboard' && 'Métricas e atividades recentes da farmácia.'}
                {activeTab === 'products' && 'Gerencie custos e margens de lucro dos ativos.'}
                {activeTab === 'categories' && 'Estruture a organização do catálogo.'}
                {activeTab === 'partners' && 'Gerencie as farmácias de manipulação parceiras.'}
                {activeTab === 'orders' && 'Histórico completo de todos os pedidos da plataforma.'}
                {activeTab === 'users' && 'Gerencie acessos e perfis de usuários.'}
                {activeTab === 'settings' && 'Parâmetros globais de cálculo de fórmulas.'}
              </p>
            </div>

            {['products', 'categories', 'partners'].includes(activeTab) && (
              <Button 
                onClick={() => {
                   setNewValues(activeTab === 'products' ? { categoryId: initialData.categories[0]?.id } : {});
                   setShowCreateModal(true);
                }}
                className="bg-vitalab-green text-white font-black px-6 shadow-vitalab-md gap-2"
              >
                <Plus size={18} /> Novo {activeTab === 'products' ? 'Ativo' : activeTab === 'categories' ? 'Categoria' : 'Parceiro'}
              </Button>
            )}
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Usuários Ativos', count: initialData.users.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Users className="text-blue-600" size={24} /> },
                   { label: 'Catálogo de Ativos', count: initialData.products.length, color: 'text-vitalab-green', bg: 'bg-vitalab-green/5', icon: <Package className="text-vitalab-green" size={24} /> },
                   { label: 'Categorias', count: initialData.categories.length, color: 'text-purple-600', bg: 'bg-purple-50', icon: <Tag className="text-purple-600" size={24} /> },
                 ].map((stat, i) => (
                   <Card key={i} className="border-vitalab-border shadow-vitalab-sm hover:shadow-vitalab-md transition-shadow cursor-default group">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-[0.7rem] font-bold text-vitalab-text-muted uppercase tracking-widest">{stat.label}</CardTitle>
                       <div className={`p-2 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                         {stat.icon}
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className={`text-4xl font-black ${stat.color}`}>{stat.count}</div>
                       <p className="text-[0.65rem] text-vitalab-text-muted mt-2 font-bold uppercase tracking-tight">+5% desde o último mês</p>
                     </CardContent>
                   </Card>
                 ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-vitalab-border shadow-vitalab-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-black text-vitalab-text">Atividade Recente</CardTitle>
                      <CardDescription>Últimos pedidos realizados na plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {initialData.orders.slice(0, 5).map(o => (
                         <div key={o.id} className="flex items-center justify-between border-b border-vitalab-border pb-4 last:border-0 last:pb-0">
                            <div>
                               <div className="font-bold text-sm text-vitalab-text">{o.formulaName}</div>
                               <div className="text-[0.65rem] text-vitalab-text-muted font-bold uppercase">{o.client.name}</div>
                            </div>
                            <Badge variant="outline" className="text-[0.6rem] font-black">{o.status}</Badge>
                         </div>
                       ))}
                    </CardContent>
                  </Card>

                  <Card className="border-vitalab-border shadow-vitalab-sm bg-vitalab-green text-white">
                    <CardHeader>
                      <CardTitle className="text-lg font-black">Suporte Vitalab</CardTitle>
                      <CardDescription className="text-white/70">Precisa de ajuda com a gestão?</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm font-medium leading-relaxed">
                         Nossa equipe está disponível para auxiliar na configuração de margens, inclusão de novos ativos e gestão de parceiros.
                       </p>
                    </CardContent>
                    <CardFooter>
                       <Button variant="secondary" className="w-full font-black">Falar com Consultor</Button>
                    </CardFooter>
                  </Card>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-vitalab-xl border border-vitalab-border shadow-vitalab-md overflow-hidden">
              <Table>
                <TableHeader className="bg-vitalab-bg/50">
                  <TableRow className="hover:bg-transparent border-vitalab-border">
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Ativo</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Cat / Unit</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Custo / g</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Fator</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Exemplo Preço</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted text-center">Status</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialData.products.map((p) => (
                    <TableRow key={p.id} className={`group transition-colors border-vitalab-border ${!p.active ? 'opacity-50' : ''}`}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl bg-vitalab-bg w-10 h-10 flex items-center justify-center rounded-lg border border-vitalab-border group-hover:scale-110 transition-transform">
                            {p.ico}
                          </span>
                          <div>
                            <div className="font-bold text-vitalab-text text-sm leading-tight">{p.name}</div>
                            {p.desc && <div className="text-[0.65rem] text-vitalab-text-muted line-clamp-1 max-w-[200px]">{p.desc}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="text-[0.6rem] font-bold uppercase tracking-widest bg-vitalab-bg/50 border-vitalab-border text-vitalab-text-muted">
                           {p.category.label}
                        </Badge>
                        <div className="text-[0.65rem] text-vitalab-text-muted font-bold mt-1 ml-1">{p.unit}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-mono font-bold text-xs text-vitalab-text">
                        R$ {p.cpg.toFixed(4).replace('.', ',')}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className={`text-xs font-bold ${p.factor ? 'text-vitalab-orange' : 'text-vitalab-text-muted'}`}>
                          {p.factor ? `${p.factor.toFixed(2)}x` : initialData.settings.factor.toFixed(2) + 'x'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                         <div className="text-xs font-bold text-red-500">
                            R$ {(p.cpg * (p.factor || initialData.settings.factor)).toFixed(2).replace('.', ',')}
                            <span className="text-[0.6rem] text-vitalab-text-muted ml-1 uppercase font-black">/ 500mg</span>
                         </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                         <Badge className={`text-[0.6rem] font-black uppercase tracking-widest ${p.active ? 'bg-vitalab-green/10 text-vitalab-green hover:bg-vitalab-green/20' : 'bg-vitalab-bg text-vitalab-text-muted hover:bg-vitalab-bg/80'}`}>
                            {p.active ? 'Ativo' : 'Inativo'}
                         </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => startEdit(p.id, { 
                                cpg: p.cpg, 
                                factor: p.factor, 
                                active: p.active,
                                name: p.name,
                                unit: p.unit,
                                ico: p.ico,
                                desc: p.desc,
                                dosesRaw: p.doses.join(', ')
                              })}
                              className="h-8 px-2 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green hover:border-vitalab-green font-bold text-[0.65rem] uppercase"
                          >
                              Editar
                          </Button>
                          <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => deleteProductAction(p.id)}
                              className="h-8 w-8 border-vitalab-border text-vitalab-text-muted hover:text-red-500 hover:border-red-500"
                          >
                              <X size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <Card className="border-vitalab-border shadow-vitalab-md">
                      <CardHeader className="border-b border-vitalab-border bg-vitalab-bg/30">
                        <div className="flex items-center gap-3 text-vitalab-green">
                          <Plus size={20} />
                          <CardTitle className="text-lg font-black">Identidade</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-vitalab-text-muted">Nome do Sistema</Label>
                          <Input 
                            className="font-bold"
                            value={editingId === 'settings' ? editValues.name : initialData.settings.name}
                            onFocus={() => startEdit('settings', { 
                              factor: initialData.settings.factor, 
                              capCost: initialData.settings.capCost,
                              name: initialData.settings.name,
                              wa: initialData.settings.wa,
                              formsRaw: initialData.settings.forms.join('\n')
                            })}
                            onChange={e => setEditValues({...editValues, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-vitalab-text-muted">WhatsApp Suporte</Label>
                          <Input 
                            className="font-mono font-bold"
                            value={editingId === 'settings' ? editValues.wa : initialData.settings.wa}
                            onFocus={() => startEdit('settings', { 
                              factor: initialData.settings.factor, 
                              capCost: initialData.settings.capCost,
                              name: initialData.settings.name,
                              wa: initialData.settings.wa,
                              formsRaw: initialData.settings.forms.join('\n')
                            })}
                            onChange={e => setEditValues({...editValues, wa: e.target.value})}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-vitalab-border shadow-vitalab-md">
                       <CardHeader className="border-b border-vitalab-border bg-vitalab-bg/30">
                        <div className="flex items-center gap-3 text-vitalab-orange">
                          <Percent size={20} />
                          <CardTitle className="text-lg font-black">Precificação Global</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                           <div className="flex justify-between items-center">
                              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-vitalab-text-muted">Fator de Lucro</Label>
                              <Badge className="bg-vitalab-orange text-white font-black">{editingId === 'settings' ? editValues.factor : initialData.settings.factor}x</Badge>
                           </div>
                           <p className="text-[0.65rem] text-vitalab-text-muted font-medium">Margem padrão aplicada a todos os ativos sem fator específico.</p>
                           <Input 
                            type="number" 
                            step="0.1"
                            className="text-lg font-black"
                            value={editingId === 'settings' ? editValues.factor : initialData.settings.factor}
                            onFocus={() => startEdit('settings', { 
                              factor: initialData.settings.factor, 
                              capCost: initialData.settings.capCost,
                              name: initialData.settings.name,
                              wa: initialData.settings.wa,
                              formsRaw: initialData.settings.forms.join('\n')
                            })}
                            onChange={e => setEditValues({...editValues, factor: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-vitalab-text-muted">Custo da Embalagem (R$)</Label>
                          <Input 
                            type="number" 
                            step="0.01"
                            className="text-lg font-black text-vitalab-green"
                            value={editingId === 'settings' ? editValues.capCost : initialData.settings.capCost}
                            onFocus={() => startEdit('settings', { 
                              factor: initialData.settings.factor, 
                              capCost: initialData.settings.capCost,
                              name: initialData.settings.name,
                              wa: initialData.settings.wa,
                              formsRaw: initialData.settings.forms.join('\n')
                            })}
                            onChange={e => setEditValues({...editValues, capCost: e.target.value})}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-vitalab-border shadow-vitalab-md h-full flex flex-col">
                     <CardHeader className="border-b border-vitalab-border bg-vitalab-bg/30">
                        <div className="flex items-center gap-3 text-vitalab-green">
                          <Building2 size={20} />
                          <CardTitle className="text-lg font-black">Formas Farmacêuticas</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 flex-1">
                        <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-vitalab-text-muted block mb-2">Opções Ativas (Uma por linha)</Label>
                        <textarea 
                          className="w-full h-[300px] p-4 rounded-vitalab-lg border border-vitalab-border focus:border-vitalab-green outline-none font-bold text-sm leading-relaxed"
                          value={editingId === 'settings' ? editValues.formsRaw : (initialData.settings.forms ? initialData.settings.forms.join('\n') : '')}
                          onFocus={() => startEdit('settings', { 
                            factor: initialData.settings.factor, 
                            capCost: initialData.settings.capCost,
                            name: initialData.settings.name,
                            wa: initialData.settings.wa,
                            formsRaw: initialData.settings.forms ? initialData.settings.forms.join('\n') : ''
                          })}
                          onChange={e => setEditValues({...editValues, formsRaw: e.target.value})}
                        />
                      </CardContent>
                      {editingId === 'settings' && (
                        <CardFooter className="border-t border-vitalab-border pt-6 gap-3">
                           <Button onClick={saveSettings} className="flex-1 bg-vitalab-green text-white font-black hover:bg-vitalab-green-text">
                            Salvar Alterações
                           </Button>
                           <Button variant="outline" onClick={cancelEdit} className="font-bold">
                            Cancelar
                           </Button>
                        </CardFooter>
                      )}
                  </Card>
               </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white rounded-vitalab-xl border border-vitalab-border shadow-vitalab-md overflow-hidden">
              <Table>
                <TableHeader className="bg-vitalab-bg/50">
                  <TableRow className="hover:bg-transparent border-vitalab-border">
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">ID</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Categoria</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialData.categories.map((c) => (
                    <TableRow key={c.id} className="group transition-colors border-vitalab-border">
                      <TableCell className="px-6 py-4 font-mono text-[0.65rem] font-bold text-vitalab-text-muted uppercase">
                        {c.id}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <span className="text-lg bg-vitalab-bg w-10 h-10 flex items-center justify-center rounded-lg border border-vitalab-border">
                            {c.ico}
                           </span>
                           <span className="font-bold text-vitalab-text">{c.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => startEdit(c.id, { label: c.label, ico: c.ico })}
                              className="h-8 px-2 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green hover:border-vitalab-green font-bold text-[0.65rem] uppercase"
                          >
                              Editar
                          </Button>
                          <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => deleteCategoryAction(c.id)}
                              className="h-8 w-8 border-vitalab-border text-vitalab-text-muted hover:text-red-500 hover:border-red-500"
                          >
                              <X size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="bg-white rounded-vitalab-xl border border-vitalab-border shadow-vitalab-md overflow-hidden">
              <Table>
                <TableHeader className="bg-vitalab-bg/50">
                  <TableRow className="hover:bg-transparent border-vitalab-border">
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Farmácia / Cidade</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Responsável</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">WhatsApp</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted text-center">Status</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialData.partners.map((p) => (
                    <TableRow key={p.id} className="group transition-colors border-vitalab-border">
                      <TableCell className="px-6 py-4">
                        <div className="font-bold text-vitalab-text text-sm">{p.name}</div>
                        <div className="text-[0.65rem] text-vitalab-text-muted uppercase font-bold">{p.city}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="font-bold text-vitalab-text text-sm">{p.pharmacist?.name || 'Sem responsável'}</div>
                        <div className="text-[0.65rem] text-vitalab-text-muted font-mono">{p.pharmacist?.email}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-mono text-xs font-bold text-vitalab-green">
                        {p.wa}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                         <Badge className={`text-[0.6rem] font-black uppercase tracking-widest ${p.active ? 'bg-vitalab-green/10 text-vitalab-green' : 'bg-vitalab-bg text-vitalab-text-muted'}`}>
                            {p.active ? 'Ativo' : 'Inativo'}
                         </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => startEdit(p.id, { 
                                name: p.name, 
                                city: p.city, 
                                wa: p.wa, 
                                rt: p.rt, 
                                active: p.active,
                                specsRaw: p.specs.join(', ')
                              })}
                              className="h-8 px-2 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green hover:border-vitalab-green font-bold text-[0.65rem] uppercase"
                          >
                              Editar
                          </Button>
                          <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => deletePartnerAction(p.id)}
                              className="h-8 w-8 border-vitalab-border text-vitalab-text-muted hover:text-red-500 hover:border-red-500"
                          >
                              <X size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-vitalab-xl border border-vitalab-border shadow-vitalab-md overflow-hidden">
               <Table>
                <TableHeader className="bg-vitalab-bg/50">
                  <TableRow className="hover:bg-transparent border-vitalab-border">
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">ID / Data</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Cliente / Farmácia</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Fórmula</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted text-center">Status</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted">Total</TableHead>
                    <TableHead className="px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest text-vitalab-text-muted text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialData.orders.map((o) => (
                    <TableRow key={o.id} className="group transition-colors border-vitalab-border">
                      <TableCell className="px-6 py-3">
                         <div className="font-mono text-[0.65rem] font-bold text-vitalab-text">#{o.id.toString().slice(-6)}</div>
                         <div className="text-[0.65rem] text-vitalab-text-muted font-bold">{new Date(o.date).toLocaleDateString('pt-BR')}</div>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                         <div className="font-bold text-vitalab-text text-xs uppercase">{o.client.name}</div>
                         <div className="text-[0.65rem] text-vitalab-text-muted font-bold italic">{o.partner.name}</div>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                         <div className="font-black text-vitalab-green text-xs line-clamp-1">{o.formulaName}</div>
                         <div className="text-[0.65rem] text-vitalab-text-muted font-bold">{o.caps} {o.form}</div>
                      </TableCell>
                      <TableCell className="px-6 py-3 text-center">
                         <Badge className={`text-[0.6rem] font-black uppercase tracking-widest ${
                          o.status === 'APPROVED' ? 'bg-vitalab-green/10 text-vitalab-green border-vitalab-green/20' :
                          o.status === 'REVIEW' ? 'bg-vitalab-orange/10 text-vitalab-orange border-vitalab-orange/20' :
                          o.status === 'ADJUSTMENT' ? 'bg-blue-100 text-blue-600 border-blue-200' : 
                          o.status === 'COMPLETED' ? 'bg-vitalab-green text-white' : 'bg-vitalab-bg text-vitalab-text-muted'
                        }`}>
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3 font-mono font-black text-vitalab-orange text-xs text-nowrap">
                         R$ {o.total.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-right">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-vitalab-border text-vitalab-text-muted hover:text-vitalab-green">
                           <Eye size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>

      {/* Resource Creation Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-vitalab-text">
              Novo {activeTab === 'products' ? 'Ativo' : activeTab === 'categories' ? 'Categoria' : 'Parceiro'}
            </DialogTitle>
            <DialogDescription className="text-sm text-vitalab-text-muted">
              Preencha os dados abaixo para cadastrar um novo registro no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === 'products' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Nome</Label>
                  <Input id="name" value={newValues.name} onChange={e => setNewValues({...newValues, name: e.target.value})} className="col-span-3 font-bold" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cpg" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Custo/g</Label>
                  <Input id="cpg" type="number" step="0.0001" value={newValues.cpg} onChange={e => setNewValues({...newValues, cpg: e.target.value})} className="col-span-3 font-mono" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Categoria</Label>
                  <select id="category" className="col-span-3 h-10 px-3 rounded-md border border-vitalab-border bg-white text-sm font-bold outline-none focus:border-vitalab-green" value={newValues.categoryId} onChange={e => setNewValues({...newValues, categoryId: e.target.value})}>
                    {initialData.categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Unidade</Label>
                  <Input id="unit" value={newValues.unit} onChange={e => setNewValues({...newValues, unit: e.target.value})} className="col-span-3" placeholder="g, mg, mL" />
                </div>
              </>
            )}
            {activeTab === 'categories' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cid" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">ID</Label>
                  <Input id="cid" value={newValues.id} onChange={e => setNewValues({...newValues, id: e.target.value})} className="col-span-3 font-mono" placeholder="suplementos" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clabel" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Nome</Label>
                  <Input id="clabel" value={newValues.label} onChange={e => setNewValues({...newValues, label: e.target.value})} className="col-span-3 font-bold" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cico" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Ícone</Label>
                  <Input id="cico" value={newValues.ico} onChange={e => setNewValues({...newValues, ico: e.target.value})} className="col-span-3" placeholder="💊" />
                </div>
              </>
            )}
            {activeTab === 'partners' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pname" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Farmácia</Label>
                  <Input id="pname" value={newValues.name} onChange={e => setNewValues({...newValues, name: e.target.value})} className="col-span-3 font-bold" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pcity" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Cidade</Label>
                  <Input id="pcity" value={newValues.city} onChange={e => setNewValues({...newValues, city: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pwa" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">WhatsApp</Label>
                  <Input id="pwa" value={newValues.wa} onChange={e => setNewValues({...newValues, wa: e.target.value})} className="col-span-3 font-mono" placeholder="55..." />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} className="bg-vitalab-green text-white font-black hover:bg-vitalab-green-text">Criar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Edit Dialog */}
      <Dialog open={!!editingId && editingId !== 'settings'} onOpenChange={(open) => !open && cancelEdit()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-vitalab-text">Editar Registro</DialogTitle>
            <DialogDescription className="text-sm text-vitalab-text-muted">
              Atualize as informações do registro selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === 'products' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ename" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Nome</Label>
                  <Input id="ename" value={editValues.name} onChange={e => setEditValues({...editValues, name: e.target.value})} className="col-span-3 font-bold" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ecpg" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Custo/g</Label>
                  <Input id="ecpg" type="number" step="0.0001" value={editValues.cpg} onChange={e => setEditValues({...editValues, cpg: e.target.value})} className="col-span-3 font-mono" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="efactor" className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Fator</Label>
                  <Input id="efactor" type="number" step="0.1" value={editValues.factor || ''} onChange={e => setEditValues({...editValues, factor: e.target.value})} className="col-span-3 font-bold text-vitalab-orange" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                   <Label className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Ativo</Label>
                   <Switch checked={editValues.active} onCheckedChange={(val) => setEditValues({...editValues, active: val})} />
                </div>
              </>
            )}
            {activeTab === 'categories' && (
              <>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Nome</Label>
                  <Input value={editValues.label} onChange={e => setEditValues({...editValues, label: e.target.value})} className="col-span-3 font-bold" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Ícone</Label>
                  <Input value={editValues.ico} onChange={e => setEditValues({...editValues, ico: e.target.value})} className="col-span-3" />
                </div>
              </>
            )}
             {activeTab === 'partners' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Farmácia</Label>
                  <Input value={editValues.name} onChange={e => setEditValues({...editValues, name: e.target.value})} className="col-span-3 font-bold" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold uppercase tracking-widest opacity-70">WhatsApp</Label>
                  <Input value={editValues.wa} onChange={e => setEditValues({...editValues, wa: e.target.value})} className="col-span-3 font-mono" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                   <Label className="text-right text-xs font-bold uppercase tracking-widest opacity-70">Ativo</Label>
                   <Switch checked={editValues.active} onCheckedChange={(val) => setEditValues({...editValues, active: val})} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
               onClick={() => {
                 if (activeTab === 'products') saveProduct(editingId as number);
                 if (activeTab === 'categories') saveCategory(editingId as string);
                 if (activeTab === 'partners') savePartner(editingId as number);
               }} 
               className="bg-vitalab-green text-white font-black"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
