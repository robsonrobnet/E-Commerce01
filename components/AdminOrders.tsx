import React, { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle, Clock, AlertTriangle, Search, Edit2, Save, X, Loader2 } from 'lucide-react';
import { Order } from '../types';
import { fetchOrders, updateOrder } from '../services/supabaseService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  // State for inline editing of Tracking Code
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
      case 'paid': return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12}/> Pago - Preparando</span>;
      case 'shipped': return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={12}/> Enviado</span>;
      case 'delivered': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12}/> Entregue</span>;
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12}/> Aguardando Pagamento</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold w-fit">Cancelado</span>;
    }
  };

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    // Optimistic update
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    // DB Update
    const success = await updateOrder(id, { status: newStatus });
    if (!success) {
       alert("Erro ao atualizar status.");
       loadData(); // Revert
    }
  };

  const startEditingTracking = (order: Order) => {
    setEditingTrackingId(order.id);
    setTempTrackingCode(order.tracking_code || '');
  };

  const cancelEditingTracking = () => {
    setEditingTrackingId(null);
    setTempTrackingCode('');
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
    o.customer_name.toLowerCase().includes(filter.toLowerCase()) ||
    (o.customer_document && o.customer_document.includes(filter))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h2 className="text-3xl font-serif font-bold text-primary">Gestão de Pedidos e Logística</h2>
           <p className="text-gray-500 mt-1">Acompanhe o status de envio e atualização de rastreio.</p>
        </div>
        
        <div className="relative w-full md:w-auto">
           <input 
             type="text" 
             placeholder="Buscar por ID, Nome ou CPF..." 
             className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-primary outline-none"
             value={filter}
             onChange={e => setFilter(e.target.value)}
           />
           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Logistics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-400 flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-500 font-bold">A Enviar</p>
               <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'paid').length}
               </p>
             </div>
             <Package className="text-blue-400" size={28} />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-400 flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-500 font-bold">Em Trânsito</p>
               <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'shipped').length}
               </p>
             </div>
             <Truck className="text-purple-400" size={28} />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-400 flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-500 font-bold">Total Pedidos</p>
               <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
             </div>
             <AlertTriangle className="text-yellow-400" size={28} />
          </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
           <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 text-gray-600 font-bold text-sm uppercase">
                <tr>
                  <th className="p-4">Pedido / Data</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Status Logístico</th>
                  <th className="p-4">Rastreio</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="font-mono font-bold text-primary text-xs">{order.id.slice(0, 8)}...</div>
                        <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">
                            {order.customer_document ? `CPF: ${order.customer_document}` : 'Doc não informado'}
                        </div>
                        <div className="text-xs font-bold text-green-700 mt-1">R$ {order.total.toFixed(2)}</div>
                      </td>
                      <td className="p-4">
                         <div className="flex flex-col gap-2">
                            {getStatusBadge(order.status)}
                            <select 
                              className="border rounded p-1 text-xs bg-white text-gray-600 outline-none focus:border-primary"
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
                      </td>
                      <td className="p-4">
                        {editingTrackingId === order.id ? (
                           <div className="flex items-center gap-2">
                              <input 
                                autoFocus
                                type="text" 
                                value={tempTrackingCode}
                                onChange={(e) => setTempTrackingCode(e.target.value)}
                                className="border border-blue-300 rounded px-2 py-1 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Código..."
                              />
                              <button onClick={() => saveTracking(order.id)} disabled={savingId === order.id} className="text-green-600 hover:bg-green-100 p-1 rounded" title="Salvar">
                                 {savingId === order.id ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                              </button>
                              <button onClick={cancelEditingTracking} disabled={savingId === order.id} className="text-red-500 hover:bg-red-100 p-1 rounded" title="Cancelar">
                                 <X size={16} />
                              </button>
                           </div>
                        ) : (
                           <div className="flex items-center gap-2 group">
                              <span className={`font-mono text-sm ${order.tracking_code ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                                 {order.tracking_code || 'Sem código'}
                              </span>
                              <button onClick={() => startEditingTracking(order)} className="opacity-0 group-hover:opacity-100 text-blue-500 hover:bg-blue-50 p-1 rounded transition" title="Editar Rastreio">
                                 <Edit2 size={14} />
                              </button>
                           </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                         <button className="text-xs font-bold text-gray-500 hover:text-primary border border-gray-200 px-3 py-1 rounded hover:border-primary transition">
                            Ver Detalhes
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;