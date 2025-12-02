
import React, { useState } from 'react';
import { Address, User, PaymentMethod } from '../types';
import { Plus, Check, Truck, CreditCard } from 'lucide-react';

interface CheckoutProps {
  user: User | null;
  onAddAddress: (address: Address) => void;
  onPlaceOrder: (details: { address: Address; payment: PaymentMethod }) => void;
  onBack: () => void;
  totalAmount: number;
}

export const Checkout: React.FC<CheckoutProps> = ({ user, onAddAddress, onPlaceOrder, onBack, totalAmount }) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(user?.addresses[0]?.id || null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // New Address State
  const [newAddr, setNewAddr] = useState({ name: '', street: '', city: '', state: '', zip: '' });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      id: Date.now().toString(),
      ...newAddr
    };
    onAddAddress(address);
    setSelectedAddressId(address.id);
    setIsAddingAddress(false);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId || !user) {
      alert("Please select a delivery address.");
      return;
    }
    const address = user.addresses.find(a => a.id === selectedAddressId);
    if (address) {
      onPlaceOrder({ address, payment: paymentMethod });
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-serif mb-4">Account Required</h2>
        <p className="text-gray-600 mb-8">Please log in to proceed with checkout.</p>
        <button onClick={onBack} className="text-black underline focus:outline-none focus:ring-2 focus:ring-black rounded px-1">Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-serif text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Details */}
        <div className="space-y-8">
          
          {/* Section 1: Address */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">Shipping Address</h2>
              {!isAddingAddress && (
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center text-sm text-black hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black rounded px-1"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add New
                </button>
              )}
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-lg space-y-4">
                <input required placeholder="Full Name" className="w-full p-2 border rounded" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} aria-label="Full Name" />
                <input required placeholder="Street Address" className="w-full p-2 border rounded" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} aria-label="Street Address" />
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="City" className="w-full p-2 border rounded" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} aria-label="City" />
                  <input required placeholder="State" className="w-full p-2 border rounded" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} aria-label="State" />
                </div>
                <input required placeholder="ZIP Code" className="w-full p-2 border rounded" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} aria-label="ZIP Code" />
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Save Address</button>
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="bg-white border text-black px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4" role="radiogroup" aria-labelledby="shipping-heading">
                {user.addresses.length === 0 && <p className="text-gray-500 italic">No addresses saved.</p>}
                {user.addresses.map((addr) => (
                  <button 
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`w-full text-left relative p-4 border rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-black ${selectedAddressId === addr.id ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
                    role="radio"
                    aria-checked={selectedAddressId === addr.id}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{addr.name}</span>
                      {selectedAddressId === addr.id && <Check className="h-5 w-5 text-black" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Payment */}
          <div>
            <h2 id="payment-heading" className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3" role="radiogroup" aria-labelledby="payment-heading">
              <button
                type="button" 
                onClick={() => setPaymentMethod('UPI')}
                className={`w-full flex items-center p-4 border rounded-lg cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-black ${paymentMethod === 'UPI' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200'}`}
                role="radio"
                aria-checked={paymentMethod === 'UPI'}
              >
                <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                <span className="flex-1 font-medium">UPI / Net Banking</span>
                {paymentMethod === 'UPI' && <div className="h-4 w-4 rounded-full bg-black" />}
              </button>
              
              <button
                type="button" 
                onClick={() => setPaymentMethod('COD')}
                className={`w-full flex items-center p-4 border rounded-lg cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-black ${paymentMethod === 'COD' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200'}`}
                role="radio"
                aria-checked={paymentMethod === 'COD'}
              >
                <Truck className="h-5 w-5 mr-3 text-gray-600" />
                <span className="flex-1 font-medium">Cash on Delivery</span>
                {paymentMethod === 'COD' && <div className="h-4 w-4 rounded-full bg-black" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="md:pl-8">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
              <span className="text-base font-medium text-gray-900">Order Total</span>
              <span className="text-2xl font-serif text-gray-900">₹{totalAmount.toLocaleString()}</span>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddressId}
              className="w-full bg-black text-white py-4 rounded-md text-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Place Order
            </button>
            <p className="mt-4 text-xs text-center text-gray-500">
              By placing this order, you agree to Dearest's Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
