import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, XCircle, Database, Copy, Bell, Mail, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';
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
  
  // Notification State
  const [adminContact, setAdminContact] = useState({
    email: '',
    phone: '',
    notifyEmail: false,
    notifyWhatsapp: false
  });
  const [alertSending, setAlertSending] = useState(false);

  useEffect(() => {
    // Load saved contact info
    const savedContact = localStorage.getItem('ADMIN_CONTACT_INFO');
    if (savedContact) {
      setAdminContact(JSON.parse(savedContact));
    }
  }, []);

  const handleSaveContact = () => {
    localStorage.setItem('ADMIN_CONTACT_INFO', JSON.stringify(adminContact));
    alert('Preferências de contato salvas!');
  };

  const handleSaveDb = async () => {
    setTestStatus('checking');
    onSaveDbConfig(localConfig);
    
    // Attempt re-init
    initSupabase(localConfig);
    const success = await checkConnection();
    
    if (success) {
      setTestStatus('success');
    } else {
      setTestStatus('error');
      // Trigger Alerts if configured
      if (adminContact.notifyEmail || adminContact.notifyWhatsapp) {
        triggerFailureAlerts();
      }
    }
  };

  const triggerFailureAlerts = async () => {
    setAlertSending(true);
    const time = new Date().toLocaleString();
    const message = `ALERTA CRÍTICO: Falha na conexão com o Banco de Dados da Loja Papelaria detectada em ${time}. Verifique as credenciais imediatamente.`;

    if (adminContact.notifyEmail && adminContact.email) {
      await sendSystemAlert({
        type: 'email',
        recipient: adminContact.email,
        message
      });
    }

    if (adminContact.notifyWhatsapp && adminContact.phone) {
      await sendSystemAlert({
        type: 'whatsapp',
        recipient: adminContact.phone,
        message
      });
    }
    setAlertSending(false);
    alert('Falha detectada! Alertas de sistema foram enviados para o administrador.');
  };

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    alert('SQL copiado para a área de transferência!');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <h2 className="text-3xl font-serif font-bold text-primary mb-6">Configurações do Sistema</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Database */}
        <div className="space-y-8">
          {/* Database Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-pastel-purple">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-primary" />
              <h3 className="text-xl font-bold text-gray-800">Banco de Dados (Supabase)</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                <input
                  type="text"
                  value={localConfig.url}
                  onChange={(e) => setLocalConfig({...localConfig, url: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
                  placeholder="https://xyz.supabase.co"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key (Anon ou Service Role)</label>
                <input
                  type="password"
                  value={localConfig.key}
                  onChange={(e) => setLocalConfig({...localConfig, key: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
                  placeholder="eyJhbGci..."
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={handleSaveDb}
                disabled={testStatus === 'checking'}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {testStatus === 'checking' ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                {testStatus === 'checking' ? 'Testando...' : 'Salvar e Testar'}
              </button>
              
              {testStatus === 'success' && (
                <span className="flex items-center gap-2 text-green-600 font-medium animate-fade-in">
                  <CheckCircle size={18} /> Conexão Estável
                </span>
              )}
              {testStatus === 'error' && (
                <span className="flex items-center gap-2 text-red-500 font-medium animate-pulse">
                  <XCircle size={18} /> Falha na Conexão
                </span>
              )}
            </div>
            
            {/* Status Alert Info */}
            {testStatus === 'error' && (alertSending ? (
               <div className="mt-3 text-xs text-orange-600 flex items-center gap-2">
                 <Loader2 size={12} className="animate-spin"/> Enviando alertas para o admin...
               </div>
            ) : (
               (adminContact.notifyEmail || adminContact.notifyWhatsapp) && (
                 <div className="mt-3 text-xs text-green-600 flex items-center gap-2">
                    <CheckCircle size={12}/> Alertas de falha enviados com sucesso.
                 </div>
               )
            ))}
          </div>
        </div>

        {/* Right Column: Alerts & Setup */}
        <div className="space-y-8">
           
           {/* Monitoring & Alerts Section */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <AlertTriangle size={100} className="text-red-500" />
              </div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                 <div className="p-2 bg-red-50 rounded-lg text-red-500"><Bell /></div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-800">Monitoramento e Alertas</h3>
                   <p className="text-xs text-gray-500">Receba avisos caso o banco de dados caia.</p>
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                       <Mail size={16} /> E-mail do Administrador
                    </label>
                    <input 
                       type="email" 
                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-200 outline-none"
                       placeholder="admin@papelaria.com"
                       value={adminContact.email}
                       onChange={(e) => setAdminContact({...adminContact, email: e.target.value})}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={adminContact.notifyEmail}
                         onChange={(e) => setAdminContact({...adminContact, notifyEmail: e.target.checked})}
                         className="rounded text-red-500 focus:ring-red-500"
                       />
                       <span className="text-sm text-gray-600">Notificar falhas por e-mail</span>
                    </label>
                 </div>

                 <div className="pt-2 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                       <MessageCircle size={16} /> WhatsApp do Administrador
                    </label>
                    <input 
                       type="tel" 
                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-200 outline-none"
                       placeholder="+55 (11) 99999-9999"
                       value={adminContact.phone}
                       onChange={(e) => setAdminContact({...adminContact, phone: e.target.value})}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={adminContact.notifyWhatsapp}
                         onChange={(e) => setAdminContact({...adminContact, notifyWhatsapp: e.target.checked})}
                         className="rounded text-green-500 focus:ring-green-500"
                       />
                       <span className="text-sm text-gray-600">Notificar falhas por WhatsApp</span>
                    </label>
                 </div>

                 <button 
                   onClick={handleSaveContact}
                   className="w-full mt-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition text-sm font-bold"
                 >
                   Salvar Preferências de Contato
                 </button>
              </div>
           </div>

           {/* Setup Instructions */}
           <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-2">Instalação Inicial</h4>
            <p className="text-sm text-gray-600 mb-3">
              Para que o sistema funcione corretamente, as tabelas precisam ser criadas no Supabase. 
              Execute o SQL abaixo no <strong>SQL Editor</strong> do seu painel.
            </p>
            <div className="relative">
              <pre className="bg-gray-800 text-gray-100 p-3 rounded text-xs overflow-x-auto h-32">
                {SQL_SETUP_SCRIPT}
              </pre>
              <button 
                onClick={copySql}
                className="absolute top-2 right-2 bg-white text-gray-800 p-1 rounded hover:bg-gray-200"
                title="Copiar SQL"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
