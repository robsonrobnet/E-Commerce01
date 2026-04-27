import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Shield, Lock, Settings, CreditCard, Wallet, Banknote } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency } from '../lib/utils';

const AdminPayments: React.FC = () => {
  const [gatewayConfig, setGatewayConfig] = useState({
    activeGateway: 'Stripe',
    testMode: true,
    apiKey: 'pk_test_********************',
    webhookSecret: 'whsec_********************'
  });

  const transactions = [
    { id: 1, desc: 'Venda #ORD-7829', type: 'in', amount: 245.90, date: 'Hoje, 14:30', method: 'Cartão Crédito' },
    { id: 2, desc: 'Venda #ORD-7830', type: 'in', amount: 89.90, date: 'Ontem, 10:15', method: 'PIX' },
    { id: 3, desc: 'Taxa Gateway', type: 'out', amount: 12.50, date: 'Ontem, 10:15', method: 'Sistema' },
    { id: 4, desc: 'Venda #ORD-7825', type: 'in', amount: 450.00, date: '23/10/2023', method: 'Boleto' },
  ];

  const pieData = [
    { name: 'Cartão', value: 65 },
    { name: 'PIX', value: 25 },
    { name: 'Boleto', value: 10 },
  ];
  const COLORS = ['#6B4C74', '#D1E8E2', '#FEF9D7'];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display font-medium text-primary-900 italic serif">Financeiro</h2>
          <p className="text-gray-500 font-medium">Controle de caixa e pagamentos.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div whileHover={{ y: -5 }} className="bg-primary-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-10 relative z-10">
             <div className="p-3 bg-white/20 rounded-2xl"><DollarSign size={24} /></div>
             <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Saldo Disponível</span>
          </div>
          <h3 className="text-4xl font-display font-medium mb-2 leading-tight">{formatCurrency(4250.90)}</h3>
          <p className="text-xs opacity-60 font-bold uppercase tracking-widest">+15% vs mês anterior</p>
        </motion.div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
           <div className="flex items-center gap-4 mb-4">
             <div className="bg-green-50 p-3 rounded-2xl text-green-600"><ArrowUpRight size={24} /></div>
             <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Entradas Brutas</p>
                <h3 className="text-2xl font-bold text-gray-800 italic serif">{formatCurrency(12580.00)}</h3>
             </div>
           </div>
           <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[80%]"></div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
           <div className="flex items-center gap-4 mb-4">
             <div className="bg-red-50 p-3 rounded-2xl text-red-600"><ArrowDownLeft size={24} /></div>
             <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Taxas do Mês</p>
                <h3 className="text-2xl font-bold text-gray-800 italic serif">{formatCurrency(840.50)}</h3>
             </div>
           </div>
           <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
              <div className="bg-red-400 h-full w-[15%]"></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Transactions */}
           <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
              <h3 className="font-display text-2xl font-medium text-gray-900 italic serif mb-8">Movimentações</h3>
              <div className="space-y-6">
                {transactions.map(t => (
                  <div key={t.id} className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-2xl transition">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-xl transition ${t.type === 'in' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {t.type === 'in' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{t.desc}</p>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">{t.date} • {t.method}</p>
                      </div>
                    </div>
                    <span className={`text-xl font-display font-medium ${t.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.type === 'in' ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
           </div>

           {/* Gateway Config */}
           <div className="bg-primary-50 rounded-[2.5rem] p-10 border border-primary/10">
              <div className="flex items-center gap-3 mb-8">
                 <Shield className="text-primary" />
                 <h3 className="text-2xl font-serif font-bold text-primary-900">Checkout e Gateway</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-white p-6 rounded-2xl">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meio de Pagamento Ativo</label>
                    <select className="w-full bg-transparent outline-none font-bold text-primary-900">
                       <option>Stripe</option>
                       <option>Mercado Pago</option>
                       <option>PIX Direto</option>
                    </select>
                 </div>
                 <div className="bg-white p-6 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modo de Teste</span>
                    <button className="w-10 h-5 bg-primary rounded-full relative">
                       <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </button>
                 </div>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Public Key</label>
                    <input type="password" value={gatewayConfig.apiKey} className="w-full p-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-primary outline-none font-mono text-xs" />
                 </div>
              </div>
              <button className="w-full mt-10 bg-primary-900 text-white py-5 rounded-2xl font-bold hover:bg-primary transition shadow-xl">Salvar Configurações Gerais</button>
           </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
           <h3 className="font-display text-xl font-medium text-gray-900 italic serif mb-8">Métodos</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <RechartsPie>
                 <Pie 
                   data={pieData} 
                   cx="50%" 
                   cy="50%" 
                   innerRadius={60} 
                   outerRadius={80} 
                   paddingAngle={5} 
                   dataKey="value"
                   stroke="none"
                 >
                   {pieData.map((_, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </RechartsPie>
             </ResponsiveContainer>
           </div>
           <div className="space-y-4 mt-8">
              {pieData.map((d, i) => (
                 <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                       <span className="text-sm font-bold text-gray-600">{d.name}</span>
                    </div>
                    <span className="text-sm font-bold text-primary-900">{d.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
