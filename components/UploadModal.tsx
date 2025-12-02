
import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category || 'Uncategorized',
      image: formData.image || 'https://images.unsplash.com/photo-1596482618218-1c42289c8038?auto=format&fit=crop&q=80&w=1000', // Default innerwear placeholder
      description: formData.description,
      reviews: [] // Initialize with empty reviews
    };

    onAddProduct(newProduct);
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      category: '',
      image: '',
      description: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true" />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button onClick={onClose} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black" aria-label="Close modal">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black/5 sm:mx-0 sm:h-10 sm:w-10">
              <Upload className="h-6 w-6 text-black" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 id="upload-modal-title" className="text-base font-semibold leading-6 text-gray-900">
                Upload New Product
              </h3>
              <div className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      autoFocus
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2 sm:text-sm"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Lace Bralette"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 text-left">Price (₹)</label>
                      <input
                        type="number"
                        id="price"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2 sm:text-sm"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        placeholder="1299"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 text-left">Category</label>
                      <input
                        type="text"
                        id="category"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2 sm:text-sm"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        placeholder="e.g., Bras, Panties"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 text-left">Image URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="url"
                        id="image"
                        className="block w-full flex-1 rounded-md border-gray-300 focus:border-black focus:ring-black border p-2 sm:text-sm"
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    
                    {/* Enhanced Preview Section */}
                    {formData.image && (
                      <div className="mt-3 relative w-full h-48 rounded-md border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="h-full w-full object-contain" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            // You could show a fallback icon here if needed
                          }} 
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="desc" className="block text-sm font-medium text-gray-700 text-left">Description</label>
                    <textarea
                      id="desc"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2 sm:text-sm"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Product details..."
                    />
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:ml-3 sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Add Product
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
