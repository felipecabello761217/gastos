import React, { useState } from 'react';
import { FinanceProvider, useFinance } from '@/contexts/FinanceContext';
import Sidebar, { View } from '@/components/finance/Sidebar';
import Dashboard from '@/components/finance/Dashboard';
import TransactionList from '@/components/finance/TransactionList';
import Analytics from '@/components/finance/Analytics';
import CategoryManager from '@/components/finance/CategoryManager';
import SettingsPanel from '@/components/finance/SettingsPanel';
import Budgets from '@/components/finance/Budgets';
import { Menu } from 'lucide-react';

const TITLES: Record<View, string> = {
  dashboard: 'Panel principal',
  transactions: 'Movimientos',
  analytics: 'Análisis',
  budgets: 'Metas de presupuesto',
  categories: 'Categorías',
  settings: 'Ajustes y personalización',
};

const Shell: React.FC = () => {
  const { cls } = useFinance();
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen flex ${cls.appBg} ${cls.text} transition-colors`}>
      <Sidebar view={view} setView={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <header className={`flex items-center gap-3 px-5 py-4 border-b ${cls.border} sticky top-0 z-20 ${cls.sidebar}`}>
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <h1 className="text-xl font-bold">{TITLES[view]}</h1>
        </header>
        <div className="p-4 sm:p-6 max-w-6xl w-full mx-auto flex-1">
          {view === 'dashboard' && <Dashboard />}
          {view === 'transactions' && <TransactionList />}
          {view === 'analytics' && <Analytics />}
          {view === 'budgets' && <Budgets />}
          {view === 'categories' && <CategoryManager />}
          {view === 'settings' && <SettingsPanel />}
        </div>
        <footer className={`px-6 py-4 text-center text-xs ${cls.textMuted} border-t ${cls.border}`}>
          FinControl · App de control de gastos · {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <FinanceProvider>
    <Shell />
  </FinanceProvider>
);

export default AppLayout;
