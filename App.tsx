
import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Checkout } from './components/Checkout';
import { ProductDetails } from './components/ProductDetails';
import { AiStylist } from './components/AiStylist';
import { UploadModal } from './components/UploadModal';
import { Logo } from './components/Logo';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, User, Address, ViewState, PaymentMethod, FilterState, Review } from './types';
import { CheckCircle, Plus, Lock } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>('HOME');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Admin State with Persistence
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('dearest_is_admin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('dearest_is_admin', isAdmin.toString());
  }, [isAdmin]);

  // Wishlist State with Persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('dearest_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dearest_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    category: ''
  });

  // --- Derived State ---
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = products.filter(product => {
    // 1. Search Term Match
    const term = searchTerm.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(term) || 
                          product.category.toLowerCase().includes(term);
    
    // 2. Category Match
    const matchesCategory = filters.category ? product.category === filters.category : true;

    // 3. Price Match
    const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
    const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
    const matchesPrice = product.price >= min && product.price <= max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // --- Handlers ---

  const handleAdminLogin = () => {
    // Prevent recursion or double prompts
    if (document.visibilityState === 'hidden') return;

    if (isAdmin) {
      if (window.confirm("Logout of Admin mode?")) {
        setIsAdmin(false);
      }
      return;
    }
    
    // Small timeout to prevent UI blocking
    setTimeout(() => {
      const password = window.prompt("Enter Admin Password:");
      if (password === "admin123") {
        setIsAdmin(true);
        alert("Admin Mode Enabled.\n\n- You are now logged in as Admin.\n- Use the (+) button in the navbar to upload products.");
      } else if (password !== null) {
        alert("Incorrect Password.");
      }
    }, 100);
  };

  // Keyboard Shortcut for Admin Login (Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        handleAdminLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Search shortcut for admin
  useEffect(() => {
    if (searchTerm.toLowerCase() === 'admin') {
      handleAdminLogin();
      setSearchTerm(''); // clear search
    }
  }, [searchTerm]);

  const handleFetchLatestProducts = () => {
    console.log("Fetching latest products...");
    // Future API call to refresh product list would go here.
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('PRODUCT_DETAILS');
    window.scrollTo(0, 0);
  };

  const handleAddReview = (productId: string, review: Review) => {
    // Update main products list
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, reviews: [review, ...(p.reviews || [])] };
      }
      return p;
    }));

    // Update selected product state if it's the one being viewed
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => prev ? ({
        ...prev,
        reviews: [review, ...(prev.reviews || [])]
      }) : null);
    }
  };

  const handleLogin = (phoneNumber: string) => {
    // Mock user retrieval or creation
    setUser({
      phoneNumber,
      addresses: [
        {
          id: '1',
          name: 'Dearest Fan',
          street: '123 Fashion Ave',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400001'
        }
      ]
    });
  };

  const handleLogout = () => {
    setUser(null);
    setView('HOME');
  };

  const handleCheckoutStart = () => {
    setIsCartOpen(false);
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setView('CHECKOUT');
    }
  };

  // If user logs in while cart is open and wanted to checkout
  useEffect(() => {
    if (user && isCartOpen === false && view === 'HOME' && cart.length > 0) {
      // Logic to auto-redirect if needed, but let's keep it manual for safety
    }
  }, [user]);

  const handleAddAddress = (address: Address) => {
    if (user) {
      setUser({
        ...user,
        addresses: [...user.addresses, address]
      });
    }
  };

  const handlePlaceOrder = (details: { address: Address; payment: PaymentMethod }) => {
    console.log("Order Placed:", { cart, details });
    setCart([]);
    setView('SUCCESS');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogoutClick={handleLogout}
        onHomeClick={() => setView('HOME')}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        onUploadClick={() => setIsUploadOpen(true)}
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        onFetchLatest={handleFetchLatestProducts}
        isAdmin={isAdmin}
      />

      <main>
        {view === 'HOME' && (
          <>
            {/* Hero Section */}
            <div className="relative bg-gray-900 h-[70vh] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1582234057635-7132800346c7?auto=format&fit=crop&q=80&w=2000"
                alt="Dearest Innerwear Collection"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="mb-6 transform hover:scale-105 transition-transform duration-700">
                  <Logo className="h-40 w-auto text-white" />
                </div>
                <p className="text-gray-200 text-lg md:text-xl max-w-xl mb-8 font-light tracking-wide">
                  Comfort meets elegance for the modern muse.
                </p>
                <div className="flex gap-4">
                   <button 
                    onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-8 py-3 rounded-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => setIsUploadOpen(true)}
                      className="border border-white text-white px-8 py-3 rounded-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      Upload Item
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  {searchTerm ? `Results for "${searchTerm}"` : 'Curated Collection'}
                </h2>
                <span className="text-sm text-gray-500">{filteredProducts.length} items</span>
              </div>
              
              {products.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isAdmin ? 'Get started by adding your first innerwear product.' : 'Our new collection is launching soon.'}
                  </p>
                  {isAdmin && (
                    <button 
                      onClick={() => setIsUploadOpen(true)}
                      className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Add Product
                    </button>
                  )}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 xl:gap-x-8">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      onClick={handleProductClick}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium text-lg">No matches found.</p>
                  <p className="text-gray-500">Try adjusting your filters or search term.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ minPrice: '', maxPrice: '', category: '' });
                    }}
                    className="mt-4 text-black underline hover:text-gray-700"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            
            {/* Promo Banner */}
            <div className="bg-brand-accent/20 py-12">
               <div className="max-w-7xl mx-auto px-4 text-center">
                  <h3 className="text-xl font-serif text-gray-900">New here?</h3>
                  <p className="mt-2 text-gray-600">Use code <span className="font-bold font-mono text-black">DEAREST20</span> for 20% off your first order.</p>
               </div>
            </div>
          </>
        )}

        {view === 'PRODUCT_DETAILS' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setView('HOME')}
            onAddReview={handleAddReview}
          />
        )}

        {view === 'CHECKOUT' && (
          <Checkout
            user={user}
            totalAmount={cartTotal} // Note: This doesn't include discount calculated in drawer. In a real app, cart state would hold discount info.
            onAddAddress={handleAddAddress}
            onBack={() => setView('HOME')}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {view === 'SUCCESS' && (
          <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
             <div className="rounded-full bg-green-100 p-6 mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
             </div>
             <h2 className="text-3xl font-serif text-gray-900 mb-4">Order Confirmed!</h2>
             <p className="text-gray-600 max-w-md mb-8">
               Thank you for shopping with Dearest. We've sent a confirmation to your phone number.
             </p>
             <button 
                onClick={() => setView('HOME')}
                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-900"
             >
               Continue Shopping
             </button>
          </div>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutStart}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      {/* Admin Protected Upload Modal */}
      {isAdmin && (
        <UploadModal 
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onAddProduct={handleAddProduct}
        />
      )}

      <AiStylist 
        view={view}
        currentProduct={selectedProduct}
        cartItems={cart}
      />
      
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400">
           <div className="flex flex-col items-start">
              <Logo className="h-16 w-auto text-white mb-4" />
              <p>Timeless elegance for the everyday.</p>
           </div>
           <div>
             <h4 className="text-white font-medium mb-4">Help</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-white">Shipping & Returns</a></li>
               <li><a href="#" className="hover:text-white">FAQ</a></li>
               <li><a href="#" className="hover:text-white">Contact Us</a></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-medium mb-4">Legal</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
               <li><a href="#" className="hover:text-white">Terms of Service</a></li>
             </ul>
           </div>
        </div>
        
        {/* Discrete Admin Login Section - Hidden from regular customers */}
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 flex justify-between items-center text-xs text-gray-600">
          <p>© 2024 Dearest. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            {/* Clear Admin Login Button */}
            <button 
              onClick={handleAdminLogin}
              className={`flex items-center gap-2 hover:text-white transition-all font-medium ${isAdmin ? 'text-white' : 'text-gray-500'}`}
              title="Admin Login (Password: admin123)"
              aria-label="Admin Access"
            >
              <Lock className="h-3 w-3" />
              <span>{isAdmin ? 'Admin Mode Active' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
