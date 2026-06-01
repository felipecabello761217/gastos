import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { StyleId, PaletteId, getPalette, getStyleClasses, ColorPalette, StyleClasses } from '@/lib/themes';
import {
  Category, Transaction, BackupRecord, TxType,
  DEFAULT_CATEGORIES, SAMPLE_TRANSACTIONS,
} from '@/lib/financeTypes';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  backups: BackupRecord[];
  budgets: Record<string, number>;
  style: StyleId;
  paletteId: PaletteId;
  currency: string;
}

interface FinanceContextType extends FinanceState {
  palette: ColorPalette;
  cls: StyleClasses;
  setStyle: (s: StyleId) => void;
  setPaletteId: (p: PaletteId) => void;
  setCurrency: (c: string) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Category, 'id'>) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  createBackup: (label?: string) => BackupRecord;
  restoreBackup: (id: string) => void;
  deleteBackup: (id: string) => void;
  importBackup: (json: string) => boolean;
  exportData: () => string;
  formatMoney: (n: number) => string;
  setBudget: (categoryId: string, amount: number) => void;
  monthlyExpenseByCategory: (categoryId: string) => number;
}

const STORAGE_KEY = 'finance-app-state-v1';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

function loadState(): FinanceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { budgets: {}, ...parsed };
    }
  } catch (_) { /* ignore */ }
  return {
    transactions: SAMPLE_TRANSACTIONS,
    categories: DEFAULT_CATEGORIES,
    backups: [],
    budgets: {},
    style: 'minimal',
    paletteId: 'ocean',
    currency: 'USD',
  };
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', MXN: '$', ARS: '$', COP: '$', CLP: '$', JPY: '¥', BRL: 'R$',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const palette = getPalette(state.paletteId);
  const cls = getStyleClasses(state.style);

  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  const setStyle = useCallback((style: StyleId) => setState((s) => ({ ...s, style })), []);
  const setPaletteId = useCallback((paletteId: PaletteId) => setState((s) => ({ ...s, paletteId })), []);
  const setCurrency = useCallback((currency: string) => setState((s) => ({ ...s, currency })), []);

  const addTransaction: FinanceContextType['addTransaction'] = (t) =>
    setState((s) => ({ ...s, transactions: [{ ...t, id: uid(), createdAt: Date.now() }, ...s.transactions] }));

  const updateTransaction: FinanceContextType['updateTransaction'] = (t) =>
    setState((s) => ({ ...s, transactions: s.transactions.map((x) => (x.id === t.id ? t : x)) }));

  const deleteTransaction = (id: string) =>
    setState((s) => ({ ...s, transactions: s.transactions.filter((x) => x.id !== id) }));

  const addCategory: FinanceContextType['addCategory'] = (c) =>
    setState((s) => ({ ...s, categories: [...s.categories, { ...c, id: uid() }] }));

  const updateCategory: FinanceContextType['updateCategory'] = (c) =>
    setState((s) => ({ ...s, categories: s.categories.map((x) => (x.id === c.id ? c : x)) }));

  const deleteCategory = (id: string) =>
    setState((s) => ({ ...s, categories: s.categories.filter((x) => x.id !== id) }));

  const exportData = useCallback(() => JSON.stringify({
    transactions: state.transactions,
    categories: state.categories,
    budgets: state.budgets,
    currency: state.currency,
    version: 1,
    exportedAt: new Date().toISOString(),
  }, null, 2), [state]);

  const createBackup: FinanceContextType['createBackup'] = (label) => {
    const rec: BackupRecord = {
      id: uid(),
      createdAt: Date.now(),
      label: label || `Respaldo ${new Date().toLocaleString('es')}`,
      data: JSON.stringify({ transactions: state.transactions, categories: state.categories, budgets: state.budgets, currency: state.currency }),
      txCount: state.transactions.length,
    };
    setState((s) => ({ ...s, backups: [rec, ...s.backups] }));
    return rec;
  };

  const restoreBackup = (id: string) =>
    setState((s) => {
      const b = s.backups.find((x) => x.id === id);
      if (!b) return s;
      try {
        const parsed = JSON.parse(b.data);
        return { ...s, transactions: parsed.transactions || [], categories: parsed.categories || s.categories, budgets: parsed.budgets || {}, currency: parsed.currency || s.currency };
      } catch { return s; }
    });

  const deleteBackup = (id: string) =>
    setState((s) => ({ ...s, backups: s.backups.filter((x) => x.id !== id) }));

  const importBackup = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.transactions || !parsed.categories) return false;
      setState((s) => ({
        ...s,
        transactions: parsed.transactions,
        categories: parsed.categories,
        budgets: parsed.budgets || {},
        currency: parsed.currency || s.currency,
      }));
      return true;
    } catch { return false; }
  };

  const formatMoney = (n: number) => {
    const sym = CURRENCY_SYMBOLS[state.currency] || '$';
    return `${n < 0 ? '-' : ''}${sym}${Math.abs(n).toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const setBudget = (categoryId: string, amount: number) =>
    setState((s) => {
      const budgets = { ...s.budgets };
      if (amount > 0) budgets[categoryId] = amount;
      else delete budgets[categoryId];
      return { ...s, budgets };
    });

  const monthlyExpenseByCategory = (categoryId: string) => {
    const now = new Date();
    return state.transactions
      .filter((t) => {
        if (t.type !== 'expense' || t.categoryId !== categoryId) return false;
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((a, t) => a + t.amount, 0);
  };

  return (
    <FinanceContext.Provider value={{
      ...state, palette, cls,
      setStyle, setPaletteId, setCurrency,
      addTransaction, updateTransaction, deleteTransaction,
      addCategory, updateCategory, deleteCategory,
      createBackup, restoreBackup, deleteBackup, importBackup, exportData,
      formatMoney, setBudget, monthlyExpenseByCategory,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
