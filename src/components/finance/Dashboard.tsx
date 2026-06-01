import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import SummaryCards from './SummaryCards';
import TransactionList from './TransactionList';
import TransactionModal from './TransactionModal';
import Icon from './Icon';
import { Plus, AlertTriangle } from 'lucide-react';

const BudgetAlerts: React.FC = () => {
  const { categories, budgets, cls, formatMoney, monthlyExpenseByCategory } = useFinance();
  const alerts = categories
    .filter((c) => c.type === 'expense' && budgets[c.id])
    .map((c) => {
      const spent = monthlyExpenseByCategory(c.id);
      const pct = (spent / budgets[c.id]) * 100;
      return { c, spent, limit: budgets[c.id], pct };
    })
    .filter((a) => a.pct >= 80)
    .sort((a, b) => b.pct - a.pct);

  if (alerts.length === 0) return null;

  return (
    <div className={`rounded-2xl p-5 ${cls.card}`}>
      <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${cls.text}`}>
        <AlertTriangle size={18} className="text-amber-500" /> Alertas de presupuesto
      </h3>
      <div className="space-y-2">
        {alerts.map(({ c, spent, limit, pct }) => {
          const over = pct >= 100;
          return (
            <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl ${over ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
              <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: c.color }}>
                <Icon name={c.icon} size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${cls.text}`}>{c.name}</p>
                <p className={`text-xs ${cls.textMuted}`}>{formatMoney(spent)} de {formatMoney(limit)}</p>
              </div>
              <span className={`text-sm font-bold ${over ? 'text-rose-500' : 'text-amber-500'}`}>
                {over ? 'Excedido' : `${pct.toFixed(0)}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const Dashboard: React.FC = () => {
  const { cls, palette } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary} 60%, ${palette.accent})` }}>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Bienvenido de nuevo</h2>
          <p className="opacity-90 mb-5">Controla tus finanzas de forma simple e intuitiva</p>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/95 text-slate-900 font-semibold shadow-lg hover:bg-white active:scale-95 transition">
            <Plus size={18} /> Registrar movimiento
          </button>
        </div>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute right-20 -bottom-16 w-40 h-40 rounded-full bg-white/10" />
      </div>

      <SummaryCards />
      <BudgetAlerts />
      <TransactionList limit={8} />
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
