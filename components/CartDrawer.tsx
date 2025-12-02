
import React, { useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { VALID_COUPONS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage) / 100 : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    const coupon = VALID_COUPONS.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-heading">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-100">
              <h2 id="cart-heading" className="text-lg font-serif font-medium text-gray-900">Shopping Cart</h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black rounded" aria-label="Close cart">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-gray-500">Your cart is empty.</p>
                  <button 
                    onClick={onClose}
                    className="text-sm font-medium text-black border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black rounded-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-50 text-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-2 py-1 text-gray-900 min-w-[1.5rem] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-50 text-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="font-medium text-red-500 hover:text-red-600 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 py-6 px-4 sm:px-6 bg-gray-50">
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <label htmlFor="coupon" className="block text-xs font-medium text-gray-700 uppercase mb-2">Have a coupon?</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-3 py-2 border"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="mt-1 text-xs text-red-500" role="alert">{couponError}</p>}
                  {appliedCoupon && <p className="mt-1 text-xs text-green-600" role="status">Coupon applied: {appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)</p>}
                </div>

                {/* Bill Summary */}
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>₹{subtotal.toLocaleString()}</p>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <p>Discount</p>
                      <p>-₹{discountAmount.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-gray-900 text-base pt-4 border-t border-gray-200">
                    <p>Total</p>
                    <p>₹{total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={onCheckout}
                    className="flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-black w-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-black hover:text-gray-800 focus:outline-none focus:underline"
                      onClick={onClose}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
