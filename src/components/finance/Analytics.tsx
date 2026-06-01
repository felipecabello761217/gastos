import React, { useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import Icon from './Icon';

const Analytics: React.FC = () => {
  const { transactions, categories, cls, palette, formatMoney } = useFinance();

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  // Category breakdown (expenses)
  const expenseByCat = useMemo(() => {
    const m: Record<string, number> = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => { m[t.categoryId] = (m[t.categoryId] || 0) + t.amount; });
    return Object.entries(m).map(([id, total]) => ({ cat: catMap[id], total }))
      .filter((x) => x.cat).sort((a, b) => b.total - a.total);
  }, [transactions, catMap]);

  const totalExpense = expenseByCat.reduce((a, x) => a + x.total, 0);

  // Last 6 months income vs expense
  const months = useMemo(() => {
    const arr: { label: string; income: number; expense: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const inc = transactions.filter((t) => t.type === 'income' && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear()).reduce((a, t) => a + t.amount, 0);
      const exp = transactions.filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear()).reduce((a, t) => a + t.amount, 0);
      arr.push({ label: d.toLocaleDateString('es', { month: 'short' }), income: inc, expense: exp });
    }
    return arr;
  }, [transactions]);

  const maxMonth = Math.max(...months.map((m) => Math.max(m.income, m.expense)), 1);

  // Donut chart
  let cumulative = 0;
  const radius = 70, circ = 2 * Math.PI * radius;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut */}
        <div className={`rounded-2xl p-6 ${cls.card}`}>
          <h3 className={`text-lg font-bold mb-4 ${cls.text}`}>Distribución de gastos</h3>
          {totalExpense === 0 ? (
            <p className={cls.textMuted}>Sin gastos registrados</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <svg width="180" height="180" viewBox="0 0 180 180" className="shrink-0">
                <circle cx="90" cy="90" r={radius} fill="none" stroke={cls.isDark ? '#1e293b' : '#f1f5f9'} strokeWidth="24" />
                {expenseByCat.map((x, i) => {
                  const frac = x.total / totalExpense;
                  const dash = frac * circ;
                  const el = (
                    <circle key={i} cx="90" cy="90" r={radius} fill="none" stroke={x.cat.color} strokeWidth="24"
                      strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-cumulative * circ}
                      transform="rotate(-90 90 90)" />
                  );
                  cumulative += frac;
                  return el;
                })}
                <text x="90" y="86" textAnchor="middle" className="font-bold" fill={cls.isDark ? '#f1f5f9' : '#0f172a'} fontSize="14">Total</text>
                <text x="90" y="104" textAnchor="middle" fill={cls.isDark ? '#94a3b8' : '#64748b'} fontSize="11">{formatMoney(totalExpense)}</text>
              </svg>
              <div className="flex-1 space-y-2 w-full">
                {expenseByCat.slice(0, 6).map((x, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ background: x.cat.color }} />
                    <span className={`flex-1 ${cls.text}`}>{x.cat.name}</span>
                    <span className={cls.textMuted}>{((x.total / totalExpense) * 100).toFixed(0)}%</span>
                    <span className={`font-medium ${cls.text}`}>{formatMoney(x.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category bars */}
        <div className={`rounded-2xl p-6 ${cls.card}`}>
          <h3 className={`text-lg font-bold mb-4 ${cls.text}`}>Gasto por categoría</h3>
          <div className="space-y-3">
            {expenseByCat.slice(0, 7).map((x, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className={`flex items-center gap-2 ${cls.text}`}>
                    <span className="w-6 h-6 rounded-md flex items-center justify-center text-white" style={{ background: x.cat.color }}>
                      <Icon name={x.cat.icon} size={13} />
                    </span>
                    {x.cat.name}
                  </span>
                  <span className={`font-medium ${cls.text}`}>{formatMoney(x.total)}</span>
                </div>
                <div className={`h-2.5 rounded-full ${cls.isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(x.total / totalExpense) * 100}%`, background: x.cat.color }} />
                </div>
              </div>
            ))}
            {expenseByCat.length === 0 && <p className={cls.textMuted}>Sin datos</p>}
          </div>
        </div>
      </div>

      {/* Monthly comparison */}
      <div className={`rounded-2xl p-6 ${cls.card}`}>
        <h3 className={`text-lg font-bold mb-5 ${cls.text}`}>Ingresos vs Egresos (6 meses)</h3>
        <div className="flex items-end justify-between gap-3 h-52">
          {months.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1 h-full w-full justify-center">
                <div className="w-1/2 max-w-[24px] rounded-t-md transition-all" style={{ height: `${(m.income / maxMonth) * 100}%`, background: palette.income, minHeight: m.income ? 4 : 0 }} title={`Ingreso: ${formatMoney(m.income)}`} />
                <div className="w-1/2 max-w-[24px] rounded-t-md transition-all" style={{ height: `${(m.expense / maxMonth) * 100}%`, background: palette.expense, minHeight: m.expense ? 4 : 0 }} title={`Egreso: ${formatMoney(m.expense)}`} />
              </div>
              <span className={`text-xs ${cls.textMuted}`}>{m.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-5 mt-4 justify-center text-sm">
          <span className={`flex items-center gap-2 ${cls.textMuted}`}><span className="w-3 h-3 rounded-full" style={{ background: palette.income }} /> Ingresos</span>
          <span className={`flex items-center gap-2 ${cls.textMuted}`}><span className="w-3 h-3 rounded-full" style={{ background: palette.expense }} /> Egresos</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
