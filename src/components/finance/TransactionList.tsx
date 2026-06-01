import React, { useState, useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction, TxType } from '@/lib/financeTypes';
import Icon from './Icon';
import TransactionModal from './TransactionModal';
import { Pencil, Trash2, Search, Plus, Filter } from 'lucide-react';

interface Props { limit?: number; showControls?: boolean; }

const TransactionList: React.FC<Props> = ({ limit, showControls = true }) => {
  const { transactions, categories, cls, palette, formatMoney, deleteTransaction } = useFinance();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | TxType>('all');
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    let list = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
    if (filterType !== 'all') list = list.filter((t) => t.type === filterType);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.note.toLowerCase().includes(q) || (catMap[t.categoryId]?.name || '').toLowerCase().includes(q));
    }
    return limit ? list.slice(0, limit) : list;
  }, [transactions, filterType, search, limit, catMap]);

  return (
    <div className={`rounded-2xl ${cls.card}`}>
      <div className="p-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className={`text-lg font-bold ${cls.text}`}>{limit ? 'Movimientos recientes' : 'Todos los movimientos'}</h3>
        {showControls && (
          <button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md active:scale-95 transition"
            style={{ background: palette.primary }}>
            <Plus size={16} /> Nuevo
          </button>
        )}
      </div>

      {showControls && !limit && (
        <div className="px-5 pb-4 flex flex-wrap gap-3">
          <div className={`flex items-center gap-2 px-3 rounded-xl border flex-1 min-w-[200px] ${cls.input}`}>
            <Search size={16} className={cls.textMuted} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..."
              className="bg-transparent outline-none py-2.5 flex-1 text-sm" />
          </div>
          <div className="flex gap-2">
            {(['all', 'income', 'expense'] as const).map((f) => (
              <button key={f} onClick={() => setFilterType(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition ${filterType === f ? 'text-white' : `${cls.textMuted} ${cls.border}`}`}
                style={filterType === f ? { background: palette.primary, borderColor: palette.primary } : undefined}>
                {f === 'all' ? 'Todos' : f === 'income' ? 'Ingresos' : 'Egresos'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`divide-y ${cls.border}`}>
        {filtered.length === 0 && (
          <div className={`p-10 text-center ${cls.textMuted}`}>
            <Filter size={32} className="mx-auto mb-2 opacity-40" />
            No hay movimientos
          </div>
        )}
        {filtered.map((t) => {
          const cat = catMap[t.categoryId];
          return (
            <div key={t.id} className={`flex items-center gap-3 px-5 py-3.5 group ${cls.cardHover}`}>
              <span className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: cat?.color || '#888' }}>
                <Icon name={cat?.icon || 'Wallet'} size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${cls.text}`}>{t.note || cat?.name || 'Sin categoría'}</p>
                <p className={`text-xs ${cls.textMuted}`}>{cat?.name} · {new Date(t.date).toLocaleDateString('es')}</p>
              </div>
              <span className={`font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount).replace('-', '')}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => { setEditing(t); setModalOpen(true); }} className={`p-1.5 rounded-lg ${cls.textMuted} hover:text-blue-500`}><Pencil size={15} /></button>
                <button onClick={() => deleteTransaction(t.id)} className={`p-1.5 rounded-lg ${cls.textMuted} hover:text-rose-500`}><Trash2 size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
};

export default TransactionList;
