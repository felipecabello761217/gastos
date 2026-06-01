import React, { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Category, TxType } from '@/lib/financeTypes';
import Icon, { ICON_NAMES } from './Icon';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Category | null;
  defaultType: TxType;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a', '#0d9488', '#0ea5e9', '#3b82f6', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'];

const CategoryModal: React.FC<Props> = ({ open, onClose, editing, defaultType }) => {
  const { cls, palette, addCategory, updateCategory } = useFinance();
  const [name, setName] = useState('');
  const [type, setType] = useState<TxType>(defaultType);
  const [icon, setIcon] = useState('Wallet');
  const [color, setColor] = useState(COLORS[6]);

  useEffect(() => {
    if (editing) { setName(editing.name); setType(editing.type); setIcon(editing.icon); setColor(editing.color); }
    else { setName(''); setType(defaultType); setIcon('Wallet'); setColor(COLORS[6]); }
  }, [editing, open, defaultType]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editing) updateCategory({ ...editing, name: name.trim(), type, icon, color });
    else addCategory({ name: name.trim(), type, icon, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-md rounded-2xl p-6 ${cls.card} ${cls.text}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">{editing ? 'Editar categoría' : 'Nueva categoría'}</h2>
          <button onClick={onClose} className={cls.textMuted}><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>
              <Icon name={icon} size={24} />
            </span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la categoría" autoFocus
              className={`flex-1 px-4 py-3 rounded-xl border outline-none ${cls.input}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['income', 'expense'] as TxType[]).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`py-2.5 rounded-xl font-medium border-2 ${type === t ? 'text-white' : `${cls.border} ${cls.textMuted}`}`}
                style={type === t ? { background: t === 'income' ? '#16a34a' : '#ef4444', borderColor: t === 'income' ? '#16a34a' : '#ef4444' } : undefined}>
                {t === 'income' ? 'Ingreso' : 'Egreso'}
              </button>
            ))}
          </div>

          <div>
            <label className={`text-sm font-medium ${cls.textMuted}`}>Color</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COLORS.map((c) => (
                <button type="button" key={c} onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition ${color === c ? 'ring-2 ring-offset-2 scale-110' : ''}`}
                  style={{ background: c, '--tw-ring-color': c } as React.CSSProperties} />
              ))}
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${cls.textMuted}`}>Ícono</label>
            <div className="grid grid-cols-8 gap-2 mt-2 max-h-32 overflow-y-auto">
              {ICON_NAMES.map((n) => (
                <button type="button" key={n} onClick={() => setIcon(n)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border ${icon === n ? 'text-white' : `${cls.textMuted} ${cls.border}`}`}
                  style={icon === n ? { background: color, borderColor: color } : undefined}>
                  <Icon name={n} size={16} />
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold shadow-lg active:scale-95 transition"
            style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
            {editing ? 'Guardar' : 'Crear categoría'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
