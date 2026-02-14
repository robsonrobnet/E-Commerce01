import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { SalesData } from '../types';

const data: SalesData[] = [
  { name: 'Seg', sales: 12, revenue: 540 },
  { name: 'Ter', sales: 19, revenue: 1200 },
  { name: 'Qua', sales: 15, revenue: 980 },
  { name: 'Qui', sales: 22, revenue: 1450 },
  { name: 'Sex', sales: 35, revenue: 2100 },
  { name: 'Sáb', sales: 45, revenue: 2800 },
  { name: 'Dom', sales: 20, revenue: 1100 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-primary">Dashboard de Gestão</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pastel-pink flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Receita Total</p>
            <p className="text-2xl font-bold text-gray-800">R$ 10.170</p>
          </div>
          <div className="p-3 bg-pastel-pink rounded-full text-primary"><DollarSign size={24} /></div>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pastel-blue flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Vendas</p>
            <p className="text-2xl font-bold text-gray-800">168</p>
          </div>
          <div className="p-3 bg-pastel-blue rounded-full text-blue-800"><TrendingUp size={24} /></div>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pastel-purple flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Produtos</p>
            <p className="text-2xl font-bold text-gray-800">54</p>
          </div>
          <div className="p-3 bg-pastel-purple rounded-full text-purple-800"><Package size={24} /></div>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pastel-green flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Clientes</p>
            <p className="text-2xl font-bold text-gray-800">120</p>
          </div>
          <div className="p-3 bg-pastel-green rounded-full text-green-800"><Users size={24} /></div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Receita Semanal</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`R$ ${value}`, 'Receita']}
                />
                <Bar dataKey="revenue" fill="#E9D5DA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Volume de Vendas</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#D1E8E2" strokeWidth={3} dot={{ r: 4, fill: '#455A64' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-700">Pedidos Recentes</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
             <tr>
               <th className="p-4">ID</th>
               <th className="p-4">Cliente</th>
               <th className="p-4">Status</th>
               <th className="p-4 text-right">Valor</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            <tr>
              <td className="p-4 text-gray-500">#ORD-001</td>
              <td className="p-4 font-medium">Ana Silva</td>
              <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span></td>
              <td className="p-4 text-right font-bold">R$ 145,00</td>
            </tr>
            <tr>
              <td className="p-4 text-gray-500">#ORD-002</td>
              <td className="p-4 font-medium">Carlos Costa</td>
              <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pago</span></td>
              <td className="p-4 text-right font-bold">R$ 89,90</td>
            </tr>
            <tr>
               <td className="p-4 text-gray-500">#ORD-003</td>
              <td className="p-4 font-medium">Beatriz Lima</td>
              <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Enviado</span></td>
              <td className="p-4 text-right font-bold">R$ 210,50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;