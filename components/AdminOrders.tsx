import React, { useState } from 'react';
import { Truck, Package, CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react';
import { Order } from '../types';

// Mock data for visualization
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7829',
    customer_name: 'Fernanda Oliveira',
    total: 245.90,
    status: 'paid',
    created_at: '2023-10-25T14:30:00',
    items: [],
  },
  {
    id: 'ORD-7830',
    customer_name: 'Ricardo Santos',
    total: 89.90,
    status: 'shipped',
    tracking_code: 'BR123456789TR',
    created_at: '2023-10-24T10:15:00',
    items: [],
  },
  {
    id: 'ORD-7831',
    customer_name: 'Camila Martins',
    total: 1200.00,
    status: 'pending',
    created_at: '2023-10-26T09:00:00',
    items: [],
  },
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Pago - Preparando</span>;
      case 'shipped': return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={12}/> Enviado</span>;
      case 'delivered': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Entregue</span>;
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Aguardando Pagamento</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">Cancelado</span>;
    }
  };

  const handleStatusChange = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-serif font-bold text-primary">Gestão de Pedidos e Logística</h2>
           <p className="text-gray-500 mt-1">Acompanhe o status de envio e preparação.</p>
        </div>
        
        <div className="relative">
           <input 
             type="text" 
             placeholder="Buscar pedido ou cliente..." 
             className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-primary outline-none"
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
               <p className="text-2xl font-bold text-gray-800">12</p>
             </div>
             <Package className="text-blue-400" size={28} />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-400 flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-500 font-bold">Em Trânsito</p>
               <p className="text-2xl font-bold text-gray-800">5</p>
             </div>
             <Truck className="text-purple-400" size={28} />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-400 flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-500 font-bold">Atrasados</p>
               <p className="text-2xl font-bold text-gray-800">1</p>
             </div>
             <AlertTriangle className="text-yellow-400" size={28} />
          </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-bold text-sm uppercase">
            <tr>
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Status Logístico</th>
              <th className="p-4">Rastreio</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono font-bold text-primary">{order.id}</td>
                <td className="p-4">
                  <div className="font-bold text-gray-800">{order.customer_name}</div>
                  <div className="text-xs text-gray-500">R$ {order.total.toFixed(2)}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-4">{getStatusBadge(order.status)}</td>
                <td className="p-4 font-mono text-sm text-gray-500">
                  {order.tracking_code || '-'}
                </td>
                <td className="p-4 text-right">
                  <select 
                    className="border rounded p-1 text-sm bg-white"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                  >
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregue</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;