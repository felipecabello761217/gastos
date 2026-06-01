export type TxType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TxType;
  icon: string; // lucide icon name
  color: string;
}

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  categoryId: string;
  date: string; // ISO date string YYYY-MM-DD
  note: string;
  createdAt: number;
}

export interface BackupRecord {
  id: string;
  createdAt: number;
  label: string;
  data: string; // serialized snapshot
  txCount: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  // income
  { id: 'c-salary', name: 'Salario', type: 'income', icon: 'Briefcase', color: '#16a34a' },
  { id: 'c-freelance', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#0d9488' },
  { id: 'c-invest', name: 'Inversiones', type: 'income', icon: 'TrendingUp', color: '#059669' },
  { id: 'c-gift', name: 'Regalos', type: 'income', icon: 'Gift', color: '#22c55e' },
  { id: 'c-rent-in', name: 'Renta', type: 'income', icon: 'Building2', color: '#15803d' },
  { id: 'c-other-in', name: 'Otros ingresos', type: 'income', icon: 'PiggyBank', color: '#4ade80' },
  // expense
  { id: 'c-food', name: 'Comida', type: 'expense', icon: 'Utensils', color: '#ef4444' },
  { id: 'c-transport', name: 'Transporte', type: 'expense', icon: 'Car', color: '#f97316' },
  { id: 'c-home', name: 'Hogar', type: 'expense', icon: 'Home', color: '#8b5cf6' },
  { id: 'c-health', name: 'Salud', type: 'expense', icon: 'HeartPulse', color: '#ec4899' },
  { id: 'c-shopping', name: 'Compras', type: 'expense', icon: 'ShoppingBag', color: '#0ea5e9' },
  { id: 'c-fun', name: 'Ocio', type: 'expense', icon: 'Gamepad2', color: '#a855f7' },
  { id: 'c-bills', name: 'Servicios', type: 'expense', icon: 'Receipt', color: '#eab308' },
  { id: 'c-edu', name: 'Educación', type: 'expense', icon: 'GraduationCap', color: '#3b82f6' },
];

const today = new Date();
function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'income', amount: 2800, categoryId: 'c-salary', date: daysAgo(2), note: 'Salario mensual', createdAt: Date.now() - 1000 },
  { id: 't2', type: 'expense', amount: 45.5, categoryId: 'c-food', date: daysAgo(1), note: 'Supermercado', createdAt: Date.now() - 2000 },
  { id: 't3', type: 'expense', amount: 120, categoryId: 'c-bills', date: daysAgo(3), note: 'Electricidad', createdAt: Date.now() - 3000 },
  { id: 't4', type: 'income', amount: 450, categoryId: 'c-freelance', date: daysAgo(5), note: 'Proyecto web', createdAt: Date.now() - 4000 },
  { id: 't5', type: 'expense', amount: 60, categoryId: 'c-transport', date: daysAgo(4), note: 'Gasolina', createdAt: Date.now() - 5000 },
  { id: 't6', type: 'expense', amount: 89.99, categoryId: 'c-shopping', date: daysAgo(6), note: 'Ropa', createdAt: Date.now() - 6000 },
  { id: 't7', type: 'expense', amount: 35, categoryId: 'c-fun', date: daysAgo(7), note: 'Cine', createdAt: Date.now() - 7000 },
  { id: 't8', type: 'income', amount: 200, categoryId: 'c-invest', date: daysAgo(8), note: 'Dividendos', createdAt: Date.now() - 8000 },
  { id: 't9', type: 'expense', amount: 75, categoryId: 'c-health', date: daysAgo(9), note: 'Farmacia', createdAt: Date.now() - 9000 },
  { id: 't10', type: 'expense', amount: 950, categoryId: 'c-home', date: daysAgo(10), note: 'Alquiler', createdAt: Date.now() - 10000 },
];
