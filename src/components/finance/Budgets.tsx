import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import Icon from './Icon';
import { AlertTriangle, CheckCircle2, Target, Pencil, X, Check } from 'lucide-react';

const Budgets: React.FC = () => {
  const { categories, budgets, cls, palette, formatMoney, setBudget, monthlyExpenseByCategory } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const expenseCats = categories.filter((c) => c.type === 'expense');

  const startEdit = (id: string) => {
    setEditingId(id);
    setDraft(budgets[id] ? String(budgets[id]) : '');
  };

  const saveEdit = (id: string) => {
    const v = parseFloat(draft);
    setBudget(id, isNaN(v) ? 0 : v);
    setEditingId(null);
  };

  // Global summary
  const withBudget = expenseCats.filter((c) => budgets[c.id]);
  const totalBudget = withBudget.reduce((a, c) => a + budgets[c.id], 0);
  const totalSpent = withBudget.reduce((a, c) => a + monthlyExpenseByCategory(c.id), 0);
  const globalPct = totalBudget ? (totalSpent / totalBudget) * 100 : 0;
  const overCount = withBudget.filter((c) => monthlyExpenseByCategory(c.id) > budgets[c.id]).length;

  const monthName = new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' });

  const statusColor = (pct: number) => (pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#22c55e');

  return (
    <div className="space-y-6">
      {/* Header summary */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Target size={22} />
            <h2 className="text-xl font-bold">Metas de presupuesto</h2>
          </div>
          <p className="opacity-90 capitalize mb-4 text-sm">{monthName}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs opacity-80">Presupuesto total</p>
              <p className="text-lg font-bold">{formatMoney(totalBudget)}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Gastado</p>
              <p className="text-lg font-bold">{formatMoney(totalSpent)}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Restante</p>
              <p className="text-lg font-bold">{formatMoney(Math.max(0, totalBudget - totalSpent))}</p>
            </div>
          </div>
          {totalBudget > 0 && (
            <div className="mt-4">
              <div className="h-2.5 rounded-full bg-white/25 overflow-hidden">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${Math.min(100, globalPct)}%` }} />
              </div>
              <p className="text-xs mt-1.5 opacity-90">
                {globalPct.toFixed(0)}% del presupuesto usado
                {overCount > 0 && ` · ${overCount} categoría${overCount > 1 ? 's' : ''} excedida${overCount > 1 ? 's' : ''}`}
              </p>
            </div>
          )}
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
      </div>

      {/* Category budgets */}
      <div className={`rounded-2xl p-5 ${cls.card}`}>
        <h3 className={`text-lg font-bold mb-1 ${cls.text}`}>Límites por categoría</h3>
        <p className={`text-sm mb-4 ${cls.textMuted}`}>Define un límite de gasto mensual para cada categoría de egreso</p>
        <div className="space-y-3">
          {expenseCats.map((c) => {
            const limit = budgets[c.id] || 0;
            const spent = monthlyExpenseByCategory(c.id);
            const pct = limit ? (spent / limit) * 100 : 0;
            const over = limit > 0 && spent > limit;
            const near = limit > 0 && !over && pct >= 80;
            const color = statusColor(pct);

            return (
              <div key={c.id} className={`p-4 rounded-xl border ${over ? 'border-rose-400 bg-rose-500/5' : near ? 'border-amber-400 bg-amber-500/5' : cls.border}`}>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: c.color }}>
                    <Icon name={c.icon} size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold truncate ${cls.text}`}>{c.name}</p>
                      {over && <span className="flex items-center gap-1 text-xs font-medium text-rose-500"><AlertTriangle size={13} /> Excedido</span>}
                      {near && <span className="flex items-center gap-1 text-xs font-medium text-amber-500"><AlertTriangle size={13} /> Cerca del límite</span>}
                      {limit > 0 && !over && !near && <span className="flex items-center gap-1 text-xs font-medium text-emerald-500"><CheckCircle2 size={13} /> En control</span>}
                    </div>
                    <p className={`text-xs ${cls.textMuted}`}>
                      {limit > 0 ? `${formatMoney(spent)} de ${formatMoney(limit)}` : 'Sin límite definido'}
                    </p>
                  </div>

                  {editingId === c.id ? (
                    <div className="flex items-center gap-1.5">
                      <input type="number" step="0.01" value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus
                        placeholder="Límite" onKeyDown={(e) => e.key === 'Enter' && saveEdit(c.id)}
                        className={`w-28 px-3 py-2 rounded-lg border outline-none text-sm ${cls.input}`} />
                      <button onClick={() => saveEdit(c.id)} className="p-2 rounded-lg text-white" style={{ background: palette.primary }}><Check size={15} /></button>
                      <button onClick={() => setEditingId(null)} className={`p-2 rounded-lg ${cls.textMuted} border ${cls.border}`}><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="text-right shrink-0">
                      {limit > 0 && <p className={`font-bold ${over ? 'text-rose-500' : cls.text}`}>{pct.toFixed(0)}%</p>}
                      <button onClick={() => startEdit(c.id)} className={`flex items-center gap-1 text-xs ${cls.textMuted} hover:underline`}>
                        <Pencil size={12} /> {limit > 0 ? 'Editar' : 'Definir límite'}
                      </button>
                    </div>
                  )}
                </div>

                {limit > 0 && (
                  <div className={`mt-3 h-2.5 rounded-full overflow-hidden ${cls.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
