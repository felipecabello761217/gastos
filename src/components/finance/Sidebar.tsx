import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { LayoutDashboard, ListChecks, PieChart, Tags, Settings, Wallet, X, Target } from 'lucide-react';

export type View = 'dashboard' | 'transactions' | 'analytics' | 'budgets' | 'categories' | 'settings';

const NAV: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'transactions', label: 'Movimientos', icon: ListChecks },
  { id: 'analytics', label: 'Análisis', icon: PieChart },
  { id: 'budgets', label: 'Presupuestos', icon: Target },
  { id: 'categories', label: 'Categorías', icon: Tags },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

interface Props {
  view: View;
  setView: (v: View) => void;
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({ view, setView, open, onClose }) => {
  const { cls, palette } = useFinance();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static z-40 h-full w-64 shrink-0 border-r ${cls.sidebar} ${cls.border} transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})` }}>
              <Wallet size={22} />
            </div>
            <div>
              <h1 className={`font-bold text-lg leading-tight ${cls.text}`}>FinControl</h1>
              <p className={`text-xs ${cls.textMuted}`}>Gestión de gastos</p>
            </div>
          </div>
          <button className={`lg:hidden ${cls.textMuted}`} onClick={onClose}><X size={20} /></button>
        </div>
        <nav className="px-3 space-y-1 mt-2">
          {NAV.map((n) => {
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => { setView(n.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'text-white shadow-md' : `${cls.textMuted} ${cls.cardHover}`}`}
                style={active ? { background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` } : undefined}
              >
                <n.icon size={19} />
                {n.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
