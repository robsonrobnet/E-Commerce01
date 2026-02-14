import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownLeft, CreditCard, PieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip } from 'recharts';

const AdminPayments: React.FC = () => {
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
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-primary">Financeiro e Pagamentos</h2>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-purple-800 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
             <div>
               <p className="opacity-80 text-sm font-medium">Saldo Disponível</p>
               <h3 className="text-3xl font-bold mt-1">R$ 4.250,90</h3>
             </div>
             <div className="bg-white/20 p-2 rounded-lg"><DollarSign /></div>
          </div>
          <p className="text-xs opacity-70">+15% em relação ao mês passado</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-green-100 p-2 rounded-full text-green-600"><ArrowUpRight size={20} /></div>
             <p className="text-gray-500 font-bold text-sm">Entradas (Mês)</p>
           </div>
           <h3 className="text-2xl font-bold text-gray-800">R$ 12.580,00</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-red-100 p-2 rounded-full text-red-600"><ArrowDownLeft size={20} /></div>
             <p className="text-gray-500 font-bold text-sm">Saídas/Taxas (Mês)</p>
           </div>
           <h3 className="text-2xl font-bold text-gray-800">R$ 840,50</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-6">Últimas Movimentações</h3>
          <div className="space-y-4">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${t.type === 'in' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {t.type === 'in' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{t.desc}</p>
                    <p className="text-xs text-gray-500">{t.date} • {t.method}</p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'in' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-primary font-bold text-sm border border-primary rounded-lg hover:bg-primary hover:text-white transition">
            Ver Extrato Completo
          </button>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
           <h3 className="font-bold text-lg text-gray-800 mb-4 w-full">Métodos de Pagamento</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <RechartsPie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                 {pieData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </RechartsPie>
             </ResponsiveContainer>
           </div>
           <div className="flex gap-4 text-xs font-bold text-gray-500">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#6B4C74]"></div> Cartão</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#D1E8E2]"></div> PIX</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FEF9D7]"></div> Boleto</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;