import { Product, Coupon } from './types';

// Initial products list is empty as requested, to allow for manual uploads.
export const PRODUCTS: Product[] = [];

export const VALID_COUPONS: Coupon[] = [
  { code: 'DEAREST20', discountPercentage: 20 },
  { code: 'WELCOME10', discountPercentage: 10 },
];