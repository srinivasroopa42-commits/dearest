
export interface Review {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  phoneNumber: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  state: string;
}

export type PaymentMethod = 'COD' | 'UPI';

export interface Coupon {
  code: string;
  discountPercentage: number;
}

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  category: string;
}

export type ViewState = 'HOME' | 'CHECKOUT' | 'SUCCESS' | 'PRODUCT_DETAILS';
