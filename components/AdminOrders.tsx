import React, { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle, Clock, AlertTriangle, Search, Edit2, X, Loader2, Filter, MoreHorizontal, User, Layout, Check } from 'lucide-react';
import { Order } from '../types';
import { fetchOrders, updateOrder } from '../services/supabaseService';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../lib/utils';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [tempTrackingCode, setTempTrackingCode] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">Pago • Preparando</span>;
      case 'shipped': return <span className="px-4 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-100">Em Trânsito</span>;
      case 'delivered': return <span className="px-4 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">Entregue</span>;
      case 'pending': return <span className="px-4 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-orange-100">Aguardando</span>;
      default: return <span className="px-4 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">Cancelado</span>;
    }
  };

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    const success = await updateOrder(id, { status: newStatus });
    if (!success) {
       alert("Erro ao atualizar status.");
       loadData();
    }
  };

  const saveTracking = async (id: string) => {
    setSavingId(id);
    const success = await updateOrder(id, { tracking_code: tempTrackingCode });
    if (success) {
      setOrders(orders.map(o => o.id === id ? { ...o, tracking_code: tempTrackingCode } : o));
      setEditingTrackingId(null);
    } else {
      alert("Erro ao salvar código de rastreio.");
    }
    setSavingId(null);
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(filter.toLowerCase()) || 
    o.customer_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
           <h2 className="text-4xl font-display font-medium text-primary-900 italic serif">Gestão Logística</h2>
           <p className="text-gray-500 font-medium">Controle de pedidos, envios e rastreamento em tempo real.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
               <input 
                 type="text" 
                 placeholder="Cliente ou Pedido..." 
                 className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl w-full shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                 value={filter}
                 onChange={e => setFilter(e.target.value)}
               />
               <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-primary transition"><Filter size={20} /></button>
        </div>
      </div>

      {/* Logistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'A Enviar', val: orders.filter(o => o.status === 'paid').length, icon: <Package />, color: 'bg-pastel-pink', text: 'text-primary' },
            { label: 'Em Trânsito', val: orders.filter(o => o.status === 'shipped').length, icon: <Truck />, color: 'bg-pastel-blue', text: 'text-blue-600' },
            { label: 'Pendentes', val: orders.filter(o => o.status === 'pending').length, icon: <Clock />, color: 'bg-pastel-orange', text: 'text-orange-600' },
            { label: 'Total Hoje', val: orders.length, icon: <Layout />, color: 'bg-pastel-green', text: 'text-green-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition">
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-display font-medium text-gray-900">{stat.val}</p>
               </div>
               <div className={`p-4 ${stat.color} ${stat.text} rounded-2xl group-hover:scale-110 transition`}>{stat.icon}</div>
            </div>
          ))}
      </div>

      {/* Orders List Container */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="p-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary" size={48} />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sincronizando Dados...</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="p-8">Identificação</th>
                  <th className="p-8">Destinatário</th>
                  <th className="p-8">Logística</th>
                  <th className="p-8">Rastreamento</th>
                  <th className="p-8 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                       <div className="flex flex-col items-center gap-3 opacity-30">
                          <AlertTriangle size={48} />
                          <p className="font-bold uppercase tracking-widest text-xs">Nenhum registro encontrado</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, i) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50/50 transition group"
                    >
                      <td className="p-8">
                        <div className="font-mono font-bold text-primary-900 bg-primary-50 w-fit px-3 py-1 rounded-lg text-xs">#{order.id.slice(0, 6)}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-tighter">
                           {new Date(order.created_at).toLocaleDateString()} às {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-primary"><User size={18} /></div>
                           <div>
                              <p className="font-serif font-bold text-gray-800 italic">{order.customer_name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{order.customer_document || 'S/ Doc'}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-8">
                         <div className="flex flex-col gap-3">
                            {getStatusBadge(order.status)}
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mudar:</span>
                               <select 
                                 className="bg-gray-50 border-none rounded-xl p-2 text-[10px] font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-8 relative"
                                 value={order.status}
                                 onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                               >
                                 <option value="pending">Pendente</option>
                                 <option value="paid">Pago</option>
                                 <option value="shipped">Enviado</option>
                                 <option value="delivered">Entregue</option>
                                 <option value="cancelled">Cancelado</option>
                               </select>
                            </div>
                         </div>
                      </td>
                      <td className="p-8">
                        {editingTrackingId === order.id ? (
                           <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-2xl border border-blue-100">
                              <input 
                                autoFocus
                                type="text" 
                                value={tempTrackingCode}
                                onChange={(e) => setTempTrackingCode(e.target.value)}
                                className="bg-transparent border-none px-2 py-1 text-xs w-32 focus:outline-none font-mono font-bold text-blue-900"
                                placeholder="Código..."
                              />
                              <button onClick={() => saveTracking(order.id)} className="bg-white text-green-600 p-2 rounded-xl shadow-sm hover:scale-110 transition">
                                 {savingId === order.id ? <Loader2 size={14} className="animate-spin"/> : <Check size={14} />}
                              </button>
                           </div>
                        ) : (
                           <div className="flex items-center gap-3">
                              <span className={`font-mono text-xs font-bold ${order.tracking_code ? 'text-primary-900' : 'text-gray-300 italic'}`}>
                                 {order.tracking_code || 'Não Postado'}
                              </span>
                              <button onClick={() => { setEditingTrackingId(order.id); setTempTrackingCode(order.tracking_code || ''); }} className="p-2 opacity-0 group-hover:opacity-100 bg-gray-50 rounded-xl text-primary hover:bg-primary hover:text-white transition group-hover:scale-110">
                                 <Edit2 size={12} />
                              </button>
                           </div>
                        )}
                      </td>
                      <td className="p-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                             <div className="text-right mr-4 leading-none">
                                <p className="text-[10px] font-bold text-gray-400 mb-1">TOTAL</p>
                                <p className="text-lg font-display font-medium text-primary-900 leading-none">{formatCurrency(order.total)}</p>
                             </div>
                             <button className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-primary-50 hover:text-primary transition"><MoreHorizontal size={20} /></button>
                         </div>
                      </td>
                    </motion.tr>
                  ))
                )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
