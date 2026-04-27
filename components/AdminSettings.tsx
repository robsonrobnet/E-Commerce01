import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, XCircle, Database, Copy, Bell, Mail, MessageCircle, AlertTriangle, Loader2, Truck, MapPin, Globe } from 'lucide-react';
import { DbConfig } from '../types';
import { initSupabase, checkConnection } from '../services/supabaseService';
import { SQL_SETUP_SCRIPT } from '../lib/constants';
import { sendSystemAlert } from '../services/notificationService';

interface AdminSettingsProps {
  dbConfig: DbConfig;
  onSaveDbConfig: (config: DbConfig) => void;
  isConnected: boolean;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ dbConfig, onSaveDbConfig, isConnected }) => {
  const [localConfig, setLocalConfig] = useState<DbConfig>(dbConfig);
  const [testStatus, setTestStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  
  const [adminContact, setAdminContact] = useState({
    email: '',
    phone: '',
    notifyEmail: false,
    notifyWhatsapp: false
  });
  
  const [shippingConfig, setShippingConfig] = useState({
    freeShippingThreshold: 150,
    fixedRate: 25,
    enableInternational: false,
    regions: [
      { name: 'Sudeste', rate: 15 },
      { name: 'Sul', rate: 18 },
      { name: 'Demais Regiões', rate: 25 }
    ]
  });

  const [alertSending, setAlertSending] = useState(false);

  useEffect(() => {
    const savedContact = localStorage.getItem('ADMIN_CONTACT_INFO');
    if (savedContact) setAdminContact(JSON.parse(savedContact));
    
    // Default config if none saved
    if (!savedContact) {
       setAdminContact({
         email: 'admin@papelaria.com',
         phone: '11999999999',
         notifyEmail: true,
         notifyWhatsapp: false
       });
    }
  }, []);

  const handleSaveContact = () => {
    localStorage.setItem('ADMIN_CONTACT_INFO', JSON.stringify(adminContact));
    alert('Preferências salvas!');
  };

  const handleSaveDb = async () => {
    setTestStatus('checking');
    onSaveDbConfig(localConfig);
    initSupabase(localConfig);
    const success = await checkConnection();
    setTestStatus(success ? 'success' : 'error');
  };

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    alert('SQL copiado!');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-display font-medium text-primary-900 italic serif">Configurações Gerais</h2>
          <p className="text-gray-500 font-medium">Infraestrutura, Logística e Alertas.</p>
        </div>
        <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-primary-900 transition flex items-center gap-2">
            <Save size={18} /> Salvar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          {/* Database Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pastel-purple rounded-2xl text-primary"><Database size={24} /></div>
              <h3 className="text-2xl font-serif font-bold text-gray-800">Conexão Supabase</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">API URL</label>
                <input
                  type="text"
                  value={localConfig.url}
                  onChange={(e) => setLocalConfig({...localConfig, url: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">API Key</label>
                <input
                  type="password"
                  value={localConfig.key}
                  onChange={(e) => setLocalConfig({...localConfig, key: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm font-mono"
                />
              </div>
              
              <div className="flex gap-3">
                 <button 
                  onClick={handleSaveDb}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-900 transition shadow-lg"
                >
                  {testStatus === 'checking' ? <Loader2 className="animate-spin" size={18}/> : 'Testar Conexão'}
                </button>
                {testStatus === 'success' && <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-2 font-bold text-xs"><CheckCircle size={16}/> OK</div>}
                {testStatus === 'error' && <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 font-bold text-xs"><XCircle size={16}/> Erro</div>}
              </div>
            </div>
          </div>

          {/* Freight Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pastel-blue rounded-2xl text-blue-600"><Truck size={24} /></div>
              <h3 className="text-2xl font-serif font-bold text-gray-800">Logística e Frete</h3>
            </div>
            
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Threshold Frete Grátis</label>
                    <div className="relative">
                       <span className="absolute left-0 top-3 text-gray-400 font-bold">R$</span>
                       <input 
                         type="number" 
                         value={shippingConfig.freeShippingThreshold}
                         onChange={(e) => setShippingConfig({...shippingConfig, freeShippingThreshold: Number(e.target.value)})}
                         className="w-full pl-6 bg-transparent border-none outline-none text-lg font-display text-primary-900 font-medium"
                       />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxa Fixa</label>
                    <div className="relative">
                       <span className="absolute left-0 top-3 text-gray-400 font-bold">R$</span>
                       <input 
                         type="number" 
                         value={shippingConfig.fixedRate}
                         onChange={(e) => setShippingConfig({...shippingConfig, fixedRate: Number(e.target.value)})}
                         className="w-full pl-6 bg-transparent border-none outline-none text-lg font-display text-primary-900 font-medium"
                       />
                    </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Taxas Regionais</p>
                  {shippingConfig.regions.map((reg, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 rounded-2xl transition">
                       <div className="flex items-center gap-3 font-bold text-gray-700">
                          <MapPin size={16} className="text-blue-400" /> {reg.name}
                       </div>
                       <input type="number" value={reg.rate} className="bg-white w-20 text-right font-bold p-1 rounded-lg border border-gray-100" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Alerts Section */}
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-red-50 rounded-2xl text-red-500"><Bell size={24} /></div>
                 <h3 className="text-2xl font-serif font-bold text-gray-800">Alertas do Sistema</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email do Administrador</label>
                    <input 
                       type="email" 
                       value={adminContact.email}
                       onChange={(e) => setAdminContact({...adminContact, email: e.target.value})}
                       className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-200 outline-none text-sm"
                    />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 font-bold text-gray-600">
                       <Mail size={18} /> Notificação por E-mail
                    </div>
                    <button 
                      onClick={() => setAdminContact({...adminContact, notifyEmail: !adminContact.notifyEmail})}
                      className={`w-12 h-6 rounded-full transition relative ${adminContact.notifyEmail ? 'bg-red-500' : 'bg-gray-200'}`}
                    >
                       <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${adminContact.notifyEmail ? 'translate-x-6' : ''}`}></div>
                    </button>
                 </div>
                 <button onClick={handleSaveContact} className="w-full py-4 text-xs font-bold uppercase tracking-widest text-primary-900 border-2 border-primary/20 rounded-2xl hover:bg-primary-50 transition">Salvar Preferências</button>
              </div>
           </div>

           {/* SQL Setup Helper */}
           <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
                 <Database size={80} />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">Script de Instalação</h3>
              <p className="text-sm text-gray-400 mb-6 relative z-10">Use este script no SQL Editor do Supabase para configurar suas tabelas.</p>
              <div className="relative z-10">
                 <pre className="bg-black/50 p-4 rounded-xl text-[10px] font-mono overflow-x-auto h-40 border border-white/10">{SQL_SETUP_SCRIPT}</pre>
                 <button onClick={copySql} className="absolute right-2 top-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"><Copy size={16}/></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
