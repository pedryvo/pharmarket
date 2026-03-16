import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fBRL = (v: number | string) => 
  'R$ ' + Number(v).toFixed(2).replace('.', ',');

export const fG = (mg: number) => 
  mg >= 1000 ? (mg / 1000).toFixed(2) + 'g' : Math.round(mg) + 'mg';
