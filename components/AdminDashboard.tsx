import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { SalesData } from '../types';
import { formatCurrency } from '../lib/utils';

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-display font-medium text-primary-900 italic serif">Visão Geral</h2>
          <p className="text-gray-500 font-medium">Bem-vindo de volta ao centro de comando.</p>
        </div>
        <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 px-3 uppercase tracking-widest">Período:</span>
            <select className="text-xs font-bold text-gray-800 bg-transparent outline-none pr-4">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Este ano</option>
            </select>
        </div>
      </div>
      
      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Faturamento', val: formatCurrency(10170), icon: <DollarSign />, color: 'bg-pastel-pink', trend: '+12%', up: true },
          { title: 'Pedidos', val: '168', icon: <TrendingUp />, color: 'bg-pastel-blue', trend: '+5%', up: true },
          { title: 'Produtos', val: '54', icon: <Package />, color: 'bg-pastel-purple', trend: 'Estável', up: null },
          { title: 'Novos Clientes', val: '120', icon: <Users />, color: 'bg-pastel-green', trend: '+8%', up: true }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-20 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-4 ${stat.color} rounded-2xl text-primary-900 shadow-sm`}>{stat.icon}</div>
              {stat.up !== null && (
                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">{stat.title}</p>
            <p className="text-3xl font-display font-medium text-gray-900 leading-tight">{stat.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-xl font-display font-medium text-gray-900 italic serif">Desempenho Financeiro</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Receita Semanal</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary-900">{formatCurrency(10170)}</span>
              <p className="text-[10px] text-green-500 font-bold">+18k vs semana anterior</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B4C74" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6B4C74" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#6B4C74', fontWeight: 'bold' }}
                  cursor={{ stroke: '#6B4C74', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6B4C74" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
           <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-xl font-display font-medium text-gray-900 italic serif">Fluxo de Vendas</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Volume de Pedidos</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#D1E8E2" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Enhanced */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-display font-medium text-gray-900 italic serif">Últimos Pedidos</h3>
          <button className="text-xs font-bold text-primary-400 uppercase tracking-widest hover:text-primary transition">Ver Todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="p-6">ID Pedido</th>
                <th className="p-6">Cliente</th>
                <th className="p-6">Status</th>
                <th className="p-6">Data</th>
                <th className="p-6 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {[
                { id: '#ORD-001', name: 'Ana Silva', status: 'Pendente', val: formatCurrency(145.00), date: 'Há 5 min', color: 'bg-orange-100 text-orange-600' },
                { id: '#ORD-002', name: 'Carlos Costa', status: 'Processado', val: formatCurrency(89.90), date: 'Há 2h', color: 'bg-green-100 text-green-600' },
                { id: '#ORD-003', name: 'Beatriz Lima', status: 'Enviado', val: formatCurrency(210.50), date: 'Hoje, 09:30', color: 'bg-blue-100 text-blue-600' }
              ].map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition duration-300">
                  <td className="p-6 font-mono font-bold text-primary-900">{order.id}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-primary">{order.name[0]}</div>
                      <span className="font-bold text-gray-700">{order.name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.color}`}>{order.status}</span>
                  </td>
                  <td className="p-6 text-gray-400 flex items-center gap-2"><Clock size={14} /> {order.date}</td>
                  <td className="p-6 text-right font-display text-lg text-primary-900 font-medium">{order.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
