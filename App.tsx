import React, { useState, useEffect } from 'react';
import { ShoppingBag, LayoutDashboard, Package, Settings, LogOut, Menu, Lock, ShoppingCart, CreditCard, BarChart, Image, Zap, Store, Tags, Cloud, Check } from 'lucide-react';
import Storefront from './components/Storefront';
import ProductDetails from './components/ProductDetails'; // Import the new component
import AdminDashboard from './components/AdminDashboard';
import AdminProducts from './components/AdminProducts';
import AdminCategories from './components/AdminCategories';
import AdminOrders from './components/AdminOrders';
import AdminPayments from './components/AdminPayments';
import AdminMarketing from './components/AdminMarketing';
import AdminIntegrations from './components/AdminIntegrations';
import AdminBanners from './components/AdminBanners';
import AdminSettings from './components/AdminSettings';
import Login from './components/Login';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import { Page, Product, CartItem, DbConfig } from './types';
import { initSupabase, checkConnection } from './services/supabaseService';

// Default provided in prompt - used for initial state
const DEFAULT_DB_CONFIG: DbConfig = {
  url: 'https://ofgfjrnplidhhvgunufn.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZ2Zqcm5wbGlkaGh2Z3VudWZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAwODY0MiwiZXhwIjoyMDg2NTg0NjQyfQ.lVhRlLYVzXkjSvbCVUOcbCsEmx2TPb7eUmeY_4O3IhA'
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.STORE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dbConfig, setDbConfig] = useState<DbConfig>(DEFAULT_DB_CONFIG);
  const [dbConnected, setDbConnected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initialize DB on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('DB_CONFIG');
    const configToUse = savedConfig ? JSON.parse(savedConfig) : DEFAULT_DB_CONFIG;
    
    setDbConfig(configToUse);
    initSupabase(configToUse);
    
    checkConnection().then(isConnected => {
      setDbConnected(isConnected);
    });
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.PRODUCT_DETAILS);
    window.scrollTo(0, 0);
  };

  const handleBackToStore = () => {
    setCurrentPage(Page.STORE);
    setSelectedProduct(null);
  };

  const handleSaveDbConfig = (newConfig: DbConfig) => {
    setDbConfig(newConfig);
    localStorage.setItem('DB_CONFIG', JSON.stringify(newConfig));
    initSupabase(newConfig);
    checkConnection().then(setDbConnected);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage(Page.ADMIN_DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage(Page.STORE);
  };

  const navClass = (page: Page) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${currentPage === page ? 'bg-pastel-pink text-primary font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`;

  // Determine if we are in "Admin Mode" layout or "Store Mode" layout
  const isAdminPage = [
    Page.ADMIN_DASHBOARD, 
    Page.ADMIN_PRODUCTS, 
    Page.ADMIN_CATEGORIES,
    Page.ADMIN_ORDERS,
    Page.ADMIN_PAYMENTS,
    Page.ADMIN_BANNERS,
    Page.ADMIN_INTEGRATIONS,
    Page.ADMIN_MARKETING,
    Page.ADMIN_SETTINGS
  ].includes(currentPage);

  // LAYOUT FOR STOREFRONT (Full width, Navbar)
  if (!isAdminPage && currentPage !== Page.LOGIN) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar 
          cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigate={setCurrentPage}
        />
        <main>
           {currentPage === Page.STORE && (
             <Storefront 
                onAddToCart={handleAddToCart} 
                onViewProduct={handleViewProduct}
                useMockData={!dbConnected} 
             />
           )}
           {currentPage === Page.PRODUCT_DETAILS && selectedProduct && (
             <ProductDetails 
                product={selectedProduct} 
                onAddToCart={handleAddToCart}
                onBack={handleBackToStore}
             />
           )}
        </main>
        
        <Cart 
          items={cartItems} 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          onRemoveItem={handleRemoveFromCart}
          onClearCart={() => setCartItems([])}
          useMockData={!dbConnected}
        />
      </div>
    );
  }

  // LAYOUT FOR LOGIN (Centered)
  if (currentPage === Page.LOGIN) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans relative">
         {/* Simple back button */}
         <div className="absolute top-6 left-6">
            <button onClick={() => setCurrentPage(Page.STORE)} className="flex items-center gap-2 text-gray-600 hover:text-primary">
                &larr; Voltar para Loja
            </button>
         </div>
         <div className="container mx-auto px-4 h-screen flex flex-col justify-center">
            <Login onLogin={handleLogin} />
         </div>
      </div>
    );
  }

  // LAYOUT FOR ADMIN (Sidebar)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header Admin */}
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-30">
        <h1 className="font-serif font-bold text-xl text-primary">Admin Panel</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`fixed md:sticky top-0 z-20 h-screen w-64 bg-white border-r border-gray-100 flex-col p-6 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shadow-xl md:shadow-none flex overflow-y-auto`}>
        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-serif font-bold text-xl">P</div>
          <h1 className="font-serif font-bold text-xl text-primary">Papelaria<br/>Admin</h1>
        </div>

        <nav className="flex-1 space-y-2">
          
          <button onClick={() => setCurrentPage(Page.ADMIN_DASHBOARD)} className={navClass(Page.ADMIN_DASHBOARD)}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-4 mb-2">Loja & Vendas</div>
          
          <button onClick={() => setCurrentPage(Page.ADMIN_PRODUCTS)} className={navClass(Page.ADMIN_PRODUCTS)}>
            <Package size={20} /> Produtos
          </button>

          <button onClick={() => setCurrentPage(Page.ADMIN_CATEGORIES)} className={navClass(Page.ADMIN_CATEGORIES)}>
            <Tags size={20} /> Categorias
          </button>
          
          <button onClick={() => setCurrentPage(Page.ADMIN_ORDERS)} className={navClass(Page.ADMIN_ORDERS)}>
            <ShoppingCart size={20} /> Pedidos
          </button>
          
          <button onClick={() => setCurrentPage(Page.ADMIN_PAYMENTS)} className={navClass(Page.ADMIN_PAYMENTS)}>
            <CreditCard size={20} /> Pagamentos
          </button>
          
          <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-4 mb-2">Marketing & Layout</div>
          
          <button onClick={() => setCurrentPage(Page.ADMIN_MARKETING)} className={navClass(Page.ADMIN_MARKETING)}>
             <BarChart size={20} /> Marketing & IA
          </button>

          <button onClick={() => setCurrentPage(Page.ADMIN_BANNERS)} className={navClass(Page.ADMIN_BANNERS)}>
            <Image size={20} /> Banners
          </button>

          <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-4 mb-2">Sistema</div>

          <button onClick={() => setCurrentPage(Page.ADMIN_INTEGRATIONS)} className={navClass(Page.ADMIN_INTEGRATIONS)}>
            <Zap size={20} /> Integrações
          </button>

          <button onClick={() => setCurrentPage(Page.ADMIN_SETTINGS)} className={navClass(Page.ADMIN_SETTINGS)}>
            <Settings size={20} /> Configurações
          </button>
          
          <div className="mt-8 pt-4 border-t border-gray-100">
             <button onClick={() => setCurrentPage(Page.STORE)} className="text-sm text-gray-500 hover:text-primary px-4 flex items-center gap-2">
                 <Store size={18} /> Ver Loja
             </button>
          </div>
        </nav>

        <div className="mt-auto pt-6 space-y-3">
           {/* GitHub Status Indicator */}
           <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                 <Cloud size={14} /> GitHub Sync
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                 <Check size={10} /> Atualizado
              </div>
           </div>

           <div className={`text-xs flex items-center gap-2 px-4 py-2 rounded ${dbConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <div className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              {dbConnected ? 'DB Online' : 'Modo Demo'}
           </div>

           <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-500 transition w-full"
            >
              <LogOut size={20} /> Sair
            </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white h-16 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-gray-700">
             {currentPage === Page.ADMIN_DASHBOARD && 'Visão Geral'}
             {currentPage === Page.ADMIN_PRODUCTS && 'Catálogo de Produtos'}
             {currentPage === Page.ADMIN_CATEGORIES && 'Categorias da Loja'}
             {currentPage === Page.ADMIN_ORDERS && 'Pedidos e Logística'}
             {currentPage === Page.ADMIN_PAYMENTS && 'Financeiro'}
             {currentPage === Page.ADMIN_MARKETING && 'Marketing e IA'}
             {currentPage === Page.ADMIN_BANNERS && 'Layout da Loja'}
             {currentPage === Page.ADMIN_INTEGRATIONS && 'Integrações Externas'}
             {currentPage === Page.ADMIN_SETTINGS && 'Configurações do Sistema'}
             {currentPage === Page.PRODUCT_DETAILS && 'Detalhes do Produto'}
          </h2>
          <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">Olá, Admin</div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {isAuthenticated ? (
                <>
                  {currentPage === Page.ADMIN_DASHBOARD && <AdminDashboard />}
                  {currentPage === Page.ADMIN_PRODUCTS && <AdminProducts useMockData={!dbConnected} />}
                  {currentPage === Page.ADMIN_CATEGORIES && <AdminCategories useMockData={!dbConnected} />}
                  {currentPage === Page.ADMIN_ORDERS && <AdminOrders />}
                  {currentPage === Page.ADMIN_PAYMENTS && <AdminPayments />}
                  {currentPage === Page.ADMIN_MARKETING && <AdminMarketing />}
                  {currentPage === Page.ADMIN_INTEGRATIONS && <AdminIntegrations />}
                  {currentPage === Page.ADMIN_BANNERS && <AdminBanners />}
                  {currentPage === Page.ADMIN_SETTINGS && (
                    <AdminSettings 
                      dbConfig={dbConfig} 
                      onSaveDbConfig={handleSaveDbConfig} 
                      isConnected={dbConnected} 
                    />
                  )}
                </>
            ) : (
                <div className="text-center py-20">Acesso negado.</div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;