import React, { useState } from 'react';
import { Plug, Check, X, RefreshCw, Key, Github, Globe, Server, Save, Loader2, GitBranch } from 'lucide-react';

interface IntegrationConfig {
  id: number;
  name: string;
  cat: string;
  status: boolean;
  icon: React.ReactNode | string;
  fields?: string[];
  autoSync?: boolean;
}

const AdminIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    { id: 1, name: 'GitHub CI/CD', cat: 'DevOps & Código', status: false, icon: <Github size={32} className="text-gray-900"/>, fields: ['Personal Access Token', 'Repository (user/repo)', 'Branch'], autoSync: false },
    { id: 2, name: 'Google Gemini AI', cat: 'Inteligência Artificial', status: true, icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg' },
    { id: 3, name: 'Stripe Payments', cat: 'Pagamentos', status: true, icon: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
    { id: 4, name: 'Correios API', cat: 'Logística', status: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_Correios.svg/1200px-Logo_Correios.svg.png' },
    { id: 5, name: 'Meta Business (WhatsApp)', cat: 'Marketing', status: true, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png' },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConfig | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggleStatus = (id: number) => {
    setIntegrations(prev => prev.map(int => int.id === id ? { ...int, status: !int.status } : int));
  };

  const openConfig = (integration: IntegrationConfig) => {
    setSelectedIntegration(integration);
    // Load mock values or existing values
    if (integration.name === 'GitHub CI/CD') {
        setConfigValues({
            'Personal Access Token': 'ghp_xxxxxxxxxxxx',
            'Repository (user/repo)': 'loja-papelaria/frontend',
            'Branch': 'main'
        });
    } else {
        setConfigValues({});
    }
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
        // Update local state logic here
        setIntegrations(prev => prev.map(int => 
            int.id === selectedIntegration.id 
            ? { ...int, status: true, autoSync: true } // Enable integration on save
            : int
        ));
        setSelectedIntegration(null);
        alert(`Configurações de ${selectedIntegration.name} salvas com sucesso!`);
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
        alert('Código sincronizado com o repositório remoto com sucesso!');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-serif font-bold text-primary">Integrações Externas</h2>
            <p className="text-gray-500">Gerencie conexões com APIs, Bancos e Repositórios.</p>
        </div>
        <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-gray-900 text-white font-bold hover:bg-gray-800 px-6 py-3 rounded-xl transition shadow-lg disabled:opacity-50"
        >
           {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
           {isSyncing ? 'Sincronizando...' : 'Deploy no GitHub'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(int => (
          <div key={int.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between h-56 relative overflow-hidden group transition hover:shadow-md ${int.status ? 'border-green-200' : 'border-gray-100'}`}>
             
             {/* Status Badge */}
             <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                 <div className={`w-3 h-3 rounded-full ${int.status ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`}></div>
                 {int.autoSync && <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded border border-blue-200">Auto-Sync</span>}
             </div>

             <div>
                <div className="w-14 h-14 bg-gray-50 rounded-xl p-3 mb-4 flex items-center justify-center border border-gray-100">
                   {typeof int.icon === 'string' ? <img src={int.icon} alt={int.name} className="max-w-full max-h-full object-contain" /> : int.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{int.name}</h3>
                <p className="text-sm text-gray-500">{int.cat}</p>
             </div>

             <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                <button 
                    onClick={() => openConfig(int)}
                    className="text-xs font-bold text-primary hover:text-purple-800 flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-lg transition"
                >
                   <Key size={12} /> Configurar
                </button>
                
                {/* Toggle Switch */}
                <div 
                    onClick={() => handleToggleStatus(int.id)}
                    className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${int.status ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${int.status ? 'translate-x-4' : ''}`}></div>
                </div>
             </div>
          </div>
        ))}
        
        {/* Add New Integration Card */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer bg-gray-50/50 h-56">
           <Plug size={40} className="mb-2" />
           <span className="font-bold">Adicionar Nova API</span>
        </div>
      </div>

      {/* Configuration Modal */}
      {selectedIntegration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
                  <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                             {typeof selectedIntegration.icon === 'string' ? <img src={selectedIntegration.icon} className="w-6 h-6" /> : selectedIntegration.icon}
                          </div>
                          <div>
                              <h3 className="font-bold text-lg text-gray-800">Configurar {selectedIntegration.name}</h3>
                              <p className="text-xs text-gray-500">Preencha as credenciais de acesso.</p>
                          </div>
                      </div>
                      <button onClick={() => setSelectedIntegration(null)} className="text-gray-400 hover:text-red-500"><X /></button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      {selectedIntegration.name === 'GitHub CI/CD' && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                              <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2 mb-1"><GitBranch size={16}/> Atualização Automática</h4>
                              <p className="text-xs text-blue-600">
                                  Ao ativar, qualquer alteração salva em Produtos ou Layout será automaticamente "commitada" e enviada (push) para o repositório configurado.
                              </p>
                          </div>
                      )}

                      {selectedIntegration.fields ? (
                          selectedIntegration.fields.map(field => (
                              <div key={field}>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">{field}</label>
                                  <input 
                                    type={field.includes('Token') ? 'password' : 'text'}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                                    placeholder={`Digite ${field}...`}
                                    defaultValue={configValues[field] || ''}
                                  />
                              </div>
                          ))
                      ) : (
                          <div className="text-center py-8 text-gray-500">
                              <Key size={40} className="mx-auto mb-2 opacity-20"/>
                              <p>Esta integração requer autenticação OAuth.</p>
                              <button className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm">Conectar Conta</button>
                          </div>
                      )}
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                      <button onClick={() => setSelectedIntegration(null)} className="px-5 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition">Cancelar</button>
                      <button onClick={handleSaveConfig} className="px-5 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-2">
                          <Save size={18} /> Salvar Conexão
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminIntegrations;