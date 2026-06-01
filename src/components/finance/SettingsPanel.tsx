import React, { useRef, useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { STYLES, PALETTES } from '@/lib/themes';
import { Check, Download, Upload, Save, RotateCcw, Trash2, Database, Palette, Layout } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'MXN', 'ARS', 'COP', 'CLP', 'JPY', 'BRL'];

const SettingsPanel: React.FC = () => {
  const {
    style, setStyle, paletteId, setPaletteId, palette, cls, currency, setCurrency,
    backups, createBackup, restoreBackup, deleteBackup, importBackup, exportData,
  } = useFinance();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 2500); };

  const downloadExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `fincontrol-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    flash('Respaldo exportado correctamente');
  };

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importBackup(String(reader.result));
      flash(ok ? 'Datos restaurados desde el archivo' : 'Error: archivo inválido');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {msg && <div className="rounded-xl px-4 py-3 text-white text-sm font-medium" style={{ background: palette.primary }}>{msg}</div>}

      {/* Interface styles */}
      <div className={`rounded-2xl p-6 ${cls.card}`}>
        <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${cls.text}`}><Layout size={20} /> Estilo de interfaz</h3>
        <p className={`text-sm mb-4 ${cls.textMuted}`}>Elige entre 5 estilos visuales distintos</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STYLES.map((s) => (
            <button key={s.id} onClick={() => setStyle(s.id)}
              className={`text-left p-4 rounded-xl border-2 transition relative ${style === s.id ? '' : cls.border}`}
              style={style === s.id ? { borderColor: palette.primary, background: palette.primary + '12' } : undefined}>
              {style === s.id && <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: palette.primary }}><Check size={12} /></span>}
              <div className={`h-12 rounded-lg mb-2 ${s.id === 'dark' ? 'bg-slate-800' : s.id === 'glass' ? 'bg-white/50 backdrop-blur border border-white' : s.id === 'neumorphic' ? 'bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bcc2,-3px_-3px_6px_#fff]' : s.id === 'vibrant' ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 'bg-white border'}`} />
              <p className={`font-semibold text-sm ${cls.text}`}>{s.name}</p>
              <p className={`text-[11px] ${cls.textMuted}`}>{s.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color palettes */}
      <div className={`rounded-2xl p-6 ${cls.card}`}>
        <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${cls.text}`}><Palette size={20} /> Paleta de colores</h3>
        <p className={`text-sm mb-4 ${cls.textMuted}`}>10 paletas curadas para tu app</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PALETTES.map((p) => (
            <button key={p.id} onClick={() => setPaletteId(p.id)}
              className={`p-3 rounded-xl border-2 transition relative ${paletteId === p.id ? '' : cls.border}`}
              style={paletteId === p.id ? { borderColor: p.primary, background: p.primary + '12' } : undefined}>
              {paletteId === p.id && <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: p.primary }}><Check size={12} /></span>}
              <div className="flex gap-1 mb-2">
                {p.swatches.slice(0, 5).map((sw, i) => <span key={i} className="flex-1 h-8 rounded" style={{ background: sw }} />)}
              </div>
              <p className={`font-semibold text-xs ${cls.text}`}>{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Currency */}
      <div className={`rounded-2xl p-6 ${cls.card}`}>
        <h3 className={`text-lg font-bold mb-3 ${cls.text}`}>Moneda</h3>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${currency === c ? 'text-white' : `${cls.textMuted} ${cls.border}`}`}
              style={currency === c ? { background: palette.primary, borderColor: palette.primary } : undefined}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Backup / Restore */}
      <div className={`rounded-2xl p-6 ${cls.card}`}>
        <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${cls.text}`}><Database size={20} /> Respaldos de la base de datos</h3>
        <p className={`text-sm mb-4 ${cls.textMuted}`}>Crea, exporta, importa y restaura tus datos</p>
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => { createBackup(); flash('Respaldo creado'); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium active:scale-95 transition" style={{ background: palette.primary }}>
            <Save size={16} /> Crear respaldo
          </button>
          <button onClick={downloadExport} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border ${cls.border} ${cls.text} ${cls.cardHover}`}>
            <Download size={16} /> Exportar JSON
          </button>
          <button onClick={() => fileRef.current?.click()} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border ${cls.border} ${cls.text} ${cls.cardHover}`}>
            <Upload size={16} /> Importar archivo
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
        </div>

        <h4 className={`text-sm font-semibold mb-2 ${cls.textMuted}`}>Historial de respaldos ({backups.length})</h4>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {backups.length === 0 && <p className={`text-sm ${cls.textMuted} py-4 text-center`}>Aún no hay respaldos</p>}
          {backups.map((b) => (
            <div key={b.id} className={`flex items-center gap-3 p-3 rounded-xl border ${cls.border}`}>
              <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: palette.secondary }}><Database size={16} /></span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${cls.text}`}>{b.label}</p>
                <p className={`text-xs ${cls.textMuted}`}>{b.txCount} movimientos · {new Date(b.createdAt).toLocaleString('es')}</p>
              </div>
              <button onClick={() => { if (window.confirm('¿Restaurar este respaldo? Se reemplazarán los datos actuales.')) { restoreBackup(b.id); flash('Respaldo restaurado'); } }}
                className={`p-2 rounded-lg ${cls.textMuted} hover:text-emerald-500`} title="Restaurar"><RotateCcw size={16} /></button>
              <button onClick={() => deleteBackup(b.id)} className={`p-2 rounded-lg ${cls.textMuted} hover:text-rose-500`} title="Eliminar"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
