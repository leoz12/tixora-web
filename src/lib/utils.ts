import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`
}

export const IMAGE_PLACEHOLDER = "/image-placeholder.jpg"
