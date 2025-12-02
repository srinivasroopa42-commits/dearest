
import React, { useState } from 'react';
import { ShoppingBag, User, Menu, LogOut, Search, PlusCircle, Filter, X, RefreshCw } from 'lucide-react';
import { User as UserType, FilterState } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  user: UserType | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
  onUploadClick: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  onFetchLatest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  user, 
  onLoginClick, 
  onLogoutClick,
  onHomeClick,
  onSearchChange,
  searchTerm,
  onUploadClick,
  filters,
  onFilterChange,
  categories,
  onFetchLatest
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = (filters.category ? 1 : 0) + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Mobile Menu Button (Placeholder) */}
          <div className="flex items-center sm:hidden">
            <button 
              className="p-2 rounded-md text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Open main menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={onHomeClick} 
              className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black rounded-sm"
              aria-label="Dearest Home"
            >
              <Logo className="h-8 w-auto text-black" />
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search items"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Fetch Latest Button */}
             <button
              onClick={onFetchLatest}
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Fetch latest products"
              title="Fetch Latest"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            {/* Upload Button */}
            <button
              onClick={onUploadClick}
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Upload product"
              title="Upload Product"
            >
              <PlusCircle className="h-5 w-5" />
            </button>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black ${isFilterOpen || activeFilterCount > 0 ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                aria-label="Filter products"
                aria-expanded={isFilterOpen}
              >
                <Filter className="h-5 w-5" />
                {activeFilterCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-black transform translate-x-1/4 -translate-y-1/4" />
                )}
              </button>

              {/* Filter Popup */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-white rounded-lg shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-black">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full rounded border-gray-300 py-1.5 px-2 text-sm focus:ring-black focus:border-black"
                          value={filters.minPrice}
                          onChange={(e) => onFilterChange({...filters, minPrice: e.target.value})}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full rounded border-gray-300 py-1.5 px-2 text-sm focus:ring-black focus:border-black"
                          value={filters.maxPrice}
                          onChange={(e) => onFilterChange({...filters, maxPrice: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        className="w-full rounded border-gray-300 py-1.5 px-2 text-sm focus:ring-black focus:border-black"
                        value={filters.category}
                        onChange={(e) => onFilterChange({...filters, category: e.target.value})}
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end">
                       <button 
                        onClick={() => {
                          onFilterChange({minPrice: '', maxPrice: '', category: ''});
                        }}
                        className="text-xs text-gray-500 hover:text-black underline"
                       >
                         Clear All
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-black"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
               <button 
                onClick={onLogoutClick}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={onLoginClick}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Log in"
                title="Log in"
              >
                <User className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
