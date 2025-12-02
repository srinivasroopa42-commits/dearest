
import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Minus, ShoppingBag, Heart, Share2, Copy, Check, Mail } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onClick: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onClick,
  isWishlisted,
  onToggleWishlist
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const increaseQuantity = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    
    // Show feedback
    setIsAdded(true);
    setQuantity(1); // Reset quantity
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(product);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShare(!showShare);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate a product link
    const url = `${window.location.origin}?product=${product.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShare(false);
    }, 2000);
  };

  return (
    <div 
      className="group relative cursor-pointer outline-none ring-offset-2 focus:ring-2 focus:ring-black rounded-sm"
      onClick={() => onClick(product)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}, price ${product.price} rupees`}
    >
      {/* Image Container with Overflow Hidden for Zoom Effect */}
      <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-200 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Quantity Selector & Quick Add Button Container */}
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex items-center justify-between bg-white rounded-full shadow-lg p-1.5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300 z-10"
          onClick={(e) => e.stopPropagation()}
          role="group"
          aria-label="Quick add to cart"
        >
          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-100 rounded-full px-1">
            <button 
              onClick={decreaseQuantity}
              className="p-1.5 text-gray-500 hover:text-black hover:bg-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Decrease quantity"
              type="button"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-xs font-semibold text-gray-900" aria-label={`Quantity ${quantity}`}>{quantity}</span>
            <button 
              onClick={increaseQuantity}
              className="p-1.5 text-gray-500 hover:text-black hover:bg-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Increase quantity"
              type="button"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add Button with Feedback State */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ml-2 flex-1 justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black ${
              isAdded 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            title="Add to Bag"
            aria-label={`Add ${quantity} ${product.name} to bag`}
            type="button"
          >
            {isAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons (Placed outside overflow-hidden container to allow popovers) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-black"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          type="button"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>

        {/* Share Button & Popover */}
        <div className="relative">
          <button
            onClick={handleShareClick}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Share product"
            type="button"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>

          {showShare && (
            <div 
              className="absolute right-full top-0 mr-2 w-40 bg-white rounded-md shadow-xl border border-gray-100 p-1 flex flex-col gap-1 z-30 animate-in fade-in zoom-in-95 slide-in-from-right-2 duration-200"
              role="menu"
              aria-orientation="vertical"
              aria-label="Share options"
            >
              <button 
                onClick={handleCopyLink} 
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-sm w-full text-left transition-colors"
                role="menuitem"
              >
                {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14}/>}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
              
              <a 
                href={`mailto:?subject=Check out this ${product.name}&body=I found this amazing item on Dearest: ${product.name} - ₹${product.price}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-sm w-full text-left transition-colors"
                role="menuitem"
              >
                <Mail size={14}/>
                <span>Email</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-medium group-hover:text-black transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};
