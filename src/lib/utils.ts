import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function brl(cents: number): string {
  return "R$ " + (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function brlShort(cents: number): string {
  const n = cents / 100;
  if (Math.abs(n) >= 1000) {
    return "R$ " + (n / 1000).toFixed(1).replace(".", ",") + "k";
  }
  return brl(cents);
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isValidPetropolisCep(cep: string): boolean {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return false;
  const num = parseInt(digits, 10);
  return num >= 25600000 && num <= 25960999;
}

export function calcDeliveryDate(offset = 2): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

export function pixDiscount(totalCents: number): number {
  return Math.round(totalCents * 0.05);
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
