import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, User, Bot, Headset, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithStoreAgent } from '../services/geminiService';
import { sendChatHandover } from '../services/webhookService';

const DEPARTMENTS = [
  { id: 'sales', name: 'Vendas', icon: '💰' },
  { id: 'support', name: 'Suporte / Trocas', icon: '🛠️' },
  { id: 'financial', name: 'Financeiro', icon: '📄' },
];

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const [handoverStatus, setHandoverStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Olá! Bem-vindo à Papelaria Encantada! 🌸 Como posso ajudar você hoje?', timestamp: new Date() }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showDepartments, handoverStatus]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call AI Service
    const aiResponseText = await chatWithStoreAgent(messages, input);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleSelectDepartment = async (deptName: string) => {
    setHandoverStatus('sending');
    
    // Trigger Webhook
    const success = await sendChatHandover(deptName, messages);

    if (success) {
        setHandoverStatus('success');
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'system',
            text: `Sua conversa foi transferida para o setor de ${deptName}. Um atendente humano responderá em breve pelo seu WhatsApp/Email cadastrado.`,
            timestamp: new Date()
        }]);
    } else {
        setHandoverStatus('idle'); // Allow retry?
        alert("Erro ao conectar com o atendente. Tente novamente.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-fade-in">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-gray-100 animate-slide-up">
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                   <Bot size={24} />
                </div>
                <div>
                   <h3 className="font-bold font-serif">Papel-IA</h3>
                   <span className="text-xs text-green-200 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online</span>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
             {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.role !== 'user' && msg.role !== 'system' && (
                      <div className="w-8 h-8 rounded-full bg-pastel-pink flex items-center justify-center mr-2 flex-shrink-0 text-primary">
                          <Bot size={16} />
                      </div>
                   )}
                   <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : msg.role === 'system'
                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 w-full text-center'
                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                   }`}>
                      {msg.text}
                   </div>
                </div>
             ))}
             
             {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
             )}

             {/* Department Selection UI */}
             {showDepartments && handoverStatus !== 'success' && (
                 <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 animate-fade-in">
                    <p className="text-sm font-bold text-gray-700 mb-3">Selecione o setor para atendimento:</p>
                    <div className="space-y-2">
                        {DEPARTMENTS.map(dept => (
                            <button 
                                key={dept.id}
                                onClick={() => handleSelectDepartment(dept.name)}
                                disabled={handoverStatus === 'sending'}
                                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition text-sm text-gray-600 group"
                            >
                                <span className="flex items-center gap-2">{dept.icon} {dept.name}</span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500"/>
                            </button>
                        ))}
                    </div>
                    {handoverStatus === 'sending' && (
                        <div className="mt-2 text-center text-xs text-blue-500 flex items-center justify-center gap-1">
                            <Loader2 size={12} className="animate-spin"/> Conectando ao sistema externo...
                        </div>
                    )}
                 </div>
             )}

             {handoverStatus === 'success' && (
                 <div className="flex flex-col items-center justify-center p-6 text-green-600">
                     <CheckCircle size={40} className="mb-2"/>
                     <p className="text-center font-bold">Solicitação Enviada!</p>
                 </div>
             )}

             <div ref={messagesEndRef} />
          </div>

          {/* Action Bar (Talk to Human) */}
          {!showDepartments && handoverStatus !== 'success' && (
             <div className="bg-gray-50 px-4 pb-2">
                <button 
                  onClick={() => setShowDepartments(true)}
                  className="w-full text-xs text-gray-500 hover:text-primary underline flex items-center justify-center gap-1 py-1"
                >
                    <Headset size={12} /> Quero falar com um atendente humano
                </button>
             </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={handleKeyPress}
               placeholder={handoverStatus === 'success' ? "Chat finalizado." : "Digite sua dúvida..."}
               disabled={handoverStatus === 'success' || showDepartments}
               className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
             />
             <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || handoverStatus === 'success' || showDepartments}
                className="bg-primary text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
             >
                <Send size={18} />
             </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition transform hover:scale-110 flex items-center gap-2 group"
        title="Ajuda / Chat"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && <span className="hidden md:inline font-bold pr-2">Dúvidas?</span>}
        
        {/* Notification Badge if closed */}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;