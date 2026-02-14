import React, { useState } from 'react';
import { Megaphone, Bot, Webhook, Send, Share2, Instagram, MessageCircle, Mail } from 'lucide-react';
import { MarketingCampaign } from '../types';

const AdminMarketing: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://meusite.com/webhook/ia-agent');
  const [agentStatus, setAgentStatus] = useState(true);
  
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    { id: '1', name: 'Promoção Volta às Aulas', channel: 'instagram', status: 'active', ai_generated: true },
    { id: '2', name: 'Oferta Relâmpago VIP', channel: 'whatsapp', status: 'draft', ai_generated: false },
    { id: '3', name: 'Newsletter Mensal', channel: 'email', status: 'completed', ai_generated: true },
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-primary">Marketing Digital & IA</h2>

      {/* AI Agent Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
           <Bot size={150} />
         </div>
         
         <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
             <Bot className="text-blue-400" size={32} />
             <h3 className="text-2xl font-bold">Agente de IA Integrado</h3>
             <span className={`px-2 py-1 rounded-full text-xs font-bold border ${agentStatus ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}`}>
                {agentStatus ? 'ATIVO' : 'INATIVO'}
             </span>
           </div>
           
           <p className="text-gray-300 max-w-xl mb-6">
             Configure seu agente inteligente para atender clientes automaticamente, tirar dúvidas sobre produtos e realizar vendas via chat.
           </p>

           <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm max-w-2xl">
             <div className="flex items-center gap-2 mb-2 text-blue-300 font-bold text-sm">
                <Webhook size={16} /> Webhook URL (Integração Externa)
             </div>
             <div className="flex gap-2">
               <input 
                 type="text" 
                 value={webhookUrl}
                 onChange={(e) => setWebhookUrl(e.target.value)}
                 className="flex-1 bg-black/30 border border-white/30 rounded px-4 py-2 text-white outline-none focus:border-blue-400 font-mono text-sm"
               />
               <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-bold transition">
                 Salvar
               </button>
             </div>
             <p className="text-xs text-gray-400 mt-2">
               Endpoint para onde o agente enviará eventos de conversação (WhatsApp/Chatbot).
             </p>
           </div>
         </div>
      </div>

      {/* Campaigns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Megaphone size={20} className="text-primary" /> Campanhas Ativas
                 </h3>
                 <button className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary/20 transition">
                   + Criar Nova
                 </button>
              </div>

              <div className="space-y-4">
                {campaigns.map(camp => (
                  <div key={camp.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition bg-gray-50/50">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full 
                          ${camp.channel === 'instagram' ? 'bg-pink-100 text-pink-600' : 
                            camp.channel === 'whatsapp' ? 'bg-green-100 text-green-600' : 
                            'bg-blue-100 text-blue-600'}`}>
                           {camp.channel === 'instagram' && <Instagram size={20} />}
                           {camp.channel === 'whatsapp' && <MessageCircle size={20} />}
                           {camp.channel === 'email' && <Mail size={20} />}
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-800">{camp.name}</h4>
                           <div className="flex items-center gap-2 mt-1">
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                               camp.status === 'active' ? 'bg-green-200 text-green-800' : 
                               camp.status === 'draft' ? 'bg-gray-200 text-gray-600' : 
                               'bg-blue-200 text-blue-800'
                             }`}>
                               {camp.status}
                             </span>
                             {camp.ai_generated && (
                               <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded flex items-center gap-1">
                                 <Bot size={10} /> IA Gerada
                               </span>
                             )}
                           </div>
                        </div>
                     </div>
                     <button className="text-gray-400 hover:text-primary"><Share2 size={18} /></button>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Gerador de Copy IA</h4>
              <textarea 
                className="w-full bg-gray-50 border p-3 rounded-lg text-sm mb-3 focus:ring-1 focus:ring-primary outline-none" 
                rows={4}
                placeholder="Descreva o produto ou oferta para gerar o texto de divulgação..."
              ></textarea>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition">
                 <Bot size={18} /> Gerar Texto
              </button>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Disparo em Massa</h4>
              <p className="text-xs text-gray-500 mb-4">Envie promoções para sua base de clientes via WhatsApp.</p>
              <button className="w-full border border-green-500 text-green-600 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition">
                 <Send size={18} /> Novo Disparo
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketing;