import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { getStylingAdvice } from '../services/gemini';
import { ViewState, Product, CartItem } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface AiStylistProps {
  view: ViewState;
  currentProduct: Product | null;
  cartItems: CartItem[];
}

export const AiStylist: React.FC<AiStylistProps> = ({ view, currentProduct, cartItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm Dearest AI. Looking for outfit inspiration or advice on our collection?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Construct dynamic context based on app state
    let context = "User is browsing the Dearest online store (Innerwear & Loungewear brand).";
    
    if (view === 'PRODUCT_DETAILS' && currentProduct) {
      context += ` They are currently viewing the product: "${currentProduct.name}". 
      Category: ${currentProduct.category}. 
      Price: ₹${currentProduct.price}. 
      Description: ${currentProduct.description || 'No description provided'}.`;
    } else if (view === 'CHECKOUT') {
      context += ` They are currently at the checkout page with ${cartItems.length} items in their cart.`;
    } else if (view === 'HOME') {
      context += ` They are browsing the main collection on the Home page.`;
    }

    if (cartItems.length > 0) {
      const cartNames = cartItems.map(i => i.name).join(', ');
      context += ` Items currently in cart: ${cartNames}.`;
    }

    const responseText = await getStylingAdvice(userMsg.text, context);

    const aiMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai' };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-black text-white rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${isOpen ? 'hidden' : 'flex items-center space-x-2'}`}
        aria-label="Open AI Stylist"
      >
        <Sparkles className="h-6 w-6" aria-hidden="true" />
        <span className="font-medium pr-2">Ask Stylist</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden h-[500px] max-h-[80vh]" role="dialog" aria-label="AI Stylist Chat">
          {/* Header */}
          <div className="bg-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-200" aria-hidden="true" />
              <h3 className="font-medium">Dearest AI Stylist</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-black text-white rounded-tr-none'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" aria-label="Thinking..." />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for advice..."
              className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
              aria-label="Message to AI Stylist"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};