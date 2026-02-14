import React, { useState } from 'react';
import { X, Trash2, CreditCard, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { createOrder } from '../services/supabaseService';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  useMockData: boolean;
}

const Cart: React.FC<CartProps> = ({ items, isOpen, onClose, onRemoveItem, onClearCart, useMockData }) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);

  // Use promotional price if available
  const total = items.reduce((acc, item) => {
    const price = item.promotional_price || item.price;
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!useMockData) {
      // Try to save to DB
      const success = await createOrder({
        customer_name: "Cliente Demo", // simplified for this UI
        total: total,
        status: 'paid',
        items: items,
        shipping_method: 'Frete Expresso (SP)' // Default selected method
      });
      if (!success) console.error("Could not save order to DB");
    }

    setLoading(false);
    setStep('success');
    setTimeout(() => {
        onClearCart();
        setStep('cart');
        onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-serif text-primary">
            {step === 'cart' ? 'Sua Sacola' : step === 'checkout' ? 'Finalizar Compra' : 'Pedido Confirmado'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 'cart' && (
            items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingCartIcon />
                <p className="mt-4">Sua sacola está vazia.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => {
                    const price = item.promotional_price || item.price;
                    return (
                      <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                        <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">R$ {price.toFixed(2)}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600">x{item.quantity}</span>
                              <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            )
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Truck size={18} /> Entrega</h3>
                <input required placeholder="Nome Completo" className="w-full border p-3 rounded mb-2 bg-gray-50" />
                <input required placeholder="CEP" className="w-full border p-3 rounded mb-2 bg-gray-50" />
                <input required placeholder="Endereço" className="w-full border p-3 rounded bg-gray-50" />
                
                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                   <span className="text-sm text-blue-800 font-bold">Frete Expresso (SP)</span>
                   <span className="text-sm text-blue-800">Grátis</span>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><CreditCard size={18} /> Pagamento</h3>
                 <div className="p-4 border rounded bg-gray-50 text-sm text-gray-500 text-center">
                    Ambiente seguro (Simulação)
                 </div>
                 <input required placeholder="Número do Cartão" className="w-full border p-3 rounded mt-2 bg-gray-50" />
                 <div className="flex gap-2 mt-2">
                    <input required placeholder="MM/AA" className="w-1/2 border p-3 rounded bg-gray-50" />
                    <input required placeholder="CVV" className="w-1/2 border p-3 rounded bg-gray-50" />
                 </div>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Truck size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pedido Recebido!</h3>
              <p className="text-gray-600">Obrigado pela compra. Você receberá um e-mail com os detalhes.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && step !== 'success' && (
          <div className="p-5 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span>
            </div>
            {step === 'cart' ? (
              <button 
                onClick={() => setStep('checkout')}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 transition"
              >
                Finalizar Compra
              </button>
            ) : (
              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition disabled:opacity-50 flex justify-center"
              >
                {loading ? 'Processando...' : 'Confirmar Pagamento'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);

export default Cart;