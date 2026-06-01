import React, { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction, TxType } from '@/lib/financeTypes';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Icon from './Icon';

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Transaction | null;
}

const TransactionModal: React.FC<Props> = ({ open, onClose, editing }) => {
  const { cls, palette, categories, addTransaction, updateTransaction } = useFinance();
  const [type, setType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setType(editing.type); setAmount(String(editing.amount));
      setCategoryId(editing.categoryId); setDate(editing.date); setNote(editing.note);
    } else {
      setType('expense'); setAmount(''); setCategoryId(''); setDate(new Date().toISOString().slice(0, 10)); setNote('');
    }
    setError('');
  }, [editing, open]);

  if (!open) return null;

  const cats = categories.filter((c) => c.type === type);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Ingresa un monto válido'); return; }
    if (!categoryId) { setError('Selecciona una categoría'); return; }
    if (editing) {
      updateTransaction({ ...editing, type, amount: amt, categoryId, date, note });
    } else {
      addTransaction({ type, amount: amt, categoryId, date, note });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-md rounded-2xl p-6 ${cls.card} ${cls.text}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">{editing ? 'Editar movimiento' : 'Nuevo movimiento'}</h2>
          <button onClick={onClose} className={cls.textMuted}><X size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button type="button" onClick={() => { setType('expense'); setCategoryId(''); }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 transition-all ${type === 'expense' ? 'border-rose-500 bg-rose-500/10 text-rose-500' : `${cls.border} ${cls.textMuted}`}`}>
            <ArrowDownCircle size={18} /> Gasto
          </button>
          <button type="button" onClick={() => { setType('income'); setCategoryId(''); }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 transition-all ${type === 'income' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : `${cls.border} ${cls.textMuted}`}`}>
            <ArrowUpCircle size={18} /> Ingreso
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={`text-sm font-medium ${cls.textMuted}`}>Monto</label>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" autoFocus
              className={`w-full mt-1 px-4 py-3 rounded-xl text-lg font-semibold border outline-none ${cls.input}`} />
          </div>

          <div>
            <label className={`text-sm font-medium ${cls.textMuted}`}>Categoría</label>
            <div className="grid grid-cols-4 gap-2 mt-1.5 max-h-40 overflow-y-auto">
              {cats.map((c) => (
                <button type="button" key={c.id} onClick={() => setCategoryId(c.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${categoryId === c.id ? '' : cls.border}`}
                  style={categoryId === c.id ? { borderColor: c.color, background: c.color + '15' } : undefined}>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: c.color }}>
                    <Icon name={c.icon} size={16} />
                  </span>
                  <span className="text-[10px] truncate w-full text-center">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={`text-sm font-medium ${cls.textMuted}`}>Fecha</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border outline-none ${cls.input}`} />
            </div>
            <div>
              <label className={`text-sm font-medium ${cls.textMuted}`}>Nota (opcional)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Descripción..."
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border outline-none ${cls.input}`} />
            </div>
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-transform active:scale-95"
            style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
            {editing ? 'Guardar cambios' : 'Agregar movimiento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
