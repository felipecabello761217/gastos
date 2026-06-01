import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';

const SummaryCards: React.FC = () => {
  const { transactions, cls, palette, formatMoney } = useFinance();

  const income = transactions.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  const now = new Date();
  const monthTx = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthExpense = monthTx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  const cards = [
    { label: 'Balance total', value: formatMoney(balance), icon: Wallet, color: palette.primary, big: true },
    { label: 'Ingresos', value: formatMoney(income), icon: TrendingUp, color: palette.income },
    { label: 'Egresos', value: formatMoney(expense), icon: TrendingDown, color: palette.expense },
    { label: 'Gasto del mes', value: formatMoney(monthExpense), icon: Calendar, color: palette.accent },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className={`rounded-2xl p-5 ${cls.card} ${c.big ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${cls.textMuted}`}>{c.label}</span>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: c.color }}>
              <c.icon size={18} />
            </span>
          </div>
          <p className={`text-2xl font-bold ${cls.text}`} style={c.big ? { color: c.color } : undefined}>{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
