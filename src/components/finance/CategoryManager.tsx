import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Category, TxType } from '@/lib/financeTypes';
import Icon from './Icon';
import CategoryModal from './CategoryModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const { categories, transactions, cls, palette, deleteCategory } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [defaultType, setDefaultType] = useState<TxType>('expense');

  const openNew = (type: TxType) => { setEditing(null); setDefaultType(type); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setDefaultType(c.type); setModalOpen(true); };

  const handleDelete = (c: Category) => {
    const used = transactions.some((t) => t.categoryId === c.id);
    if (used && !window.confirm(`"${c.name}" tiene movimientos asociados. ¿Eliminar de todas formas?`)) return;
    if (!used && !window.confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
    deleteCategory(c.id);
  };

  const renderGroup = (type: TxType) => {
    const list = categories.filter((c) => c.type === type);
    return (
      <div className={`rounded-2xl p-5 ${cls.card}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${cls.text}`}>{type === 'income' ? 'Categorías de ingresos' : 'Categorías de egresos'}</h3>
          <button onClick={() => openNew(type)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-medium active:scale-95 transition" style={{ background: palette.primary }}>
            <Plus size={15} /> Agregar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {list.map((c) => (
            <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border group ${cls.border} ${cls.cardHover}`}>
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: c.color }}>
                <Icon name={c.icon} size={18} />
              </span>
              <span className={`flex-1 font-medium truncate ${cls.text}`}>{c.name}</span>
              <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition">
                <button onClick={() => openEdit(c)} className={`p-1.5 rounded-lg ${cls.textMuted} hover:text-blue-500`}><Pencil size={15} /></button>
                <button onClick={() => handleDelete(c)} className={`p-1.5 rounded-lg ${cls.textMuted} hover:text-rose-500`}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className={`${cls.textMuted} col-span-2 py-4 text-center text-sm`}>Sin categorías</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderGroup('expense')}
      {renderGroup('income')}
      <CategoryModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} defaultType={defaultType} />
    </div>
  );
};

export default CategoryManager;
