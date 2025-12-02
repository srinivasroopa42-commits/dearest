
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Star, User, Maximize2, X } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBack: () => void;
  onAddReview: (productId: string, review: Review) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onAddToCart, onBack, onAddReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: Date.now().toString(),
      userName: name || 'Anonymous',
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    onAddReview(product.id, newReview);
    setComment('');
    setName('');
    setRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="group flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors focus:outline-none focus:underline"
        aria-label="Back to Collection"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse">
          <button 
            type="button"
            className="w-full aspect-[3/4] rounded-sm overflow-hidden bg-gray-100 relative group cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-black"
            onClick={() => setIsZoomOpen(true)}
            aria-label="View larger image"
          >
             <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-sm">
                <Maximize2 className="h-5 w-5 text-gray-700" />
            </div>
          </button>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 tracking-wide uppercase">{product.category}</h3>
            <div className="flex justify-between items-start mt-2">
              <h1 className="text-3xl font-serif font-medium text-gray-900">{product.name}</h1>
              {averageRating > 0 && (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded" aria-label={`Rated ${averageRating.toFixed(1)} out of 5 stars`}>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="text-2xl font-light text-gray-900 mt-4">₹{product.price.toLocaleString()}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 my-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Description</h3>
            <div className="prose prose-sm text-gray-500">
              <p className="whitespace-pre-line">{product.description || "No description available for this item."}</p>
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => onAddToCart(product, 1)}
              className="w-full bg-black border border-transparent rounded-sm py-4 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Bag
            </button>
            
            <div className="flex flex-col space-y-4 text-sm text-gray-500 pt-6">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-3 text-gray-400" aria-hidden="true" />
                <span>Free shipping on orders over ₹2000</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-3 text-gray-400" aria-hidden="true" />
                <span>Secure payment & authentic products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-serif text-gray-900 mb-8">Customer Reviews</h2>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Review Form */}
          <div className="lg:col-span-5 mb-10 lg:mb-0">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex space-x-1" role="group" aria-label="Select star rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none focus:ring-1 focus:ring-black rounded p-0.5"
                        aria-label={`Rate ${star} stars`}
                        aria-pressed={star <= rating}
                      >
                        <Star 
                          className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2 sm:text-sm bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Share your thoughts..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2 sm:text-sm bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-7 space-y-6">
            {(!product.reviews || product.reviews.length === 0) ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full p-1 mr-3">
                        <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
                      </div>
                      <span className="font-medium text-gray-900">{review.userName}</span>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex mb-2" aria-label={`Rated ${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isZoomOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
            onClick={() => setIsZoomOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Full screen image view"
        >
            <button 
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                aria-label="Close image view"
            >
                <X className="h-8 w-8" />
            </button>
            <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain shadow-2xl rounded-sm select-none"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
      )}
    </div>
  );
};
