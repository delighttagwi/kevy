import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-ZW', {
    style: 'currency',
    currency: 'USD', // Zimbabwean e-commerce often uses USD for stability in pricing
  }).format(price);
}
