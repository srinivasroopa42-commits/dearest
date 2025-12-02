
import React, { useState } from 'react';
import { X, Smartphone } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (phone: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'PHONE') {
      if (phone.length >= 10) {
        setStep('OTP');
      } else {
        alert('Please enter a valid phone number');
      }
    } else {
      // Simulate OTP check
      if (otp === '1234') {
        onLogin(phone);
        setPhone('');
        setOtp('');
        setStep('PHONE');
        onClose();
      } else {
        alert('Invalid OTP. (Try 1234)');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true" />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button onClick={onClose} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black" aria-label="Close modal">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
              <Smartphone className="h-6 w-6 text-gray-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 id="modal-title" className="text-base font-semibold leading-6 text-gray-900">
                {step === 'PHONE' ? 'Login or Sign up' : 'Enter OTP'}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-4">
                  {step === 'PHONE' 
                    ? 'Enter your phone number to access your account.' 
                    : `We sent a code to ${phone}. (Hint: 1234)`}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {step === 'PHONE' ? (
                    <div>
                      <label htmlFor="phone" className="sr-only">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        autoFocus
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        placeholder="Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="otp" className="sr-only">OTP</label>
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        autoFocus
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 tracking-[0.5em] text-center font-mono"
                        placeholder="••••"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {step === 'PHONE' ? 'Continue' : 'Verify & Login'}
                  </button>
                  
                  {step === 'OTP' && (
                    <button 
                      type="button" 
                      onClick={() => setStep('PHONE')}
                      className="block w-full text-center text-xs text-gray-500 hover:text-black mt-2 focus:outline-none focus:underline"
                    >
                      Change Number
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
