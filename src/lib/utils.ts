
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Simple function to format Chilean phone numbers
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `+56 ${match[1]} ${match[2]} ${match[3]}`;
  }
  return phoneNumber;
}
