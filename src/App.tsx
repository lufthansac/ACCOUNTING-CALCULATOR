/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  RefreshCcw, 
  Calculator, 
  FileText,
  AlertCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalEntry, JournalItem, DEFAULT_ACCOUNTS } from './types';

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentItems, setCurrentItems] = useState<JournalItem[]>([
    { id: '1', accountId: '', accountName: '', ref: '', debit: 0, credit: 0 },
    { id: '2', accountId: '', accountName: '', ref: '', debit: 0, credit: 0 }
  ]);

  const addItem = () => {
    setCurrentItems([
      ...currentItems,
      { id: Date.now().toString(), accountId: '', accountName: '', ref: '', debit: 0, credit: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (currentItems.length > 1) {
      setCurrentItems(currentItems.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof JournalItem, value: any) => {
    setCurrentItems(currentItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // If accountId changes, update accountName and ref
        if (field === 'accountId') {
          const account = DEFAULT_ACCOUNTS.find(a => a.id === value);
          if (account) {
            updated.accountName = account.name;
            updated.ref = account.code;
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const totalDebit = useMemo(() => currentItems.reduce((sum, item) => sum + (Number(item.debit) || 0), 0), [currentItems]);
  const totalCredit = useMemo(() => currentItems.reduce((sum, item) => sum + (Number(item.credit) || 0), 0), [currentItems]);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSaveEntry = () => {
    if (!isBalanced) return;
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: currentDate,
      description: currentDescription,
      items: [...currentItems]
    };

    setEntries([newEntry, ...entries]);
    
    // Reset form
    setCurrentDescription('');
    setCurrentItems([
      { id: '1', accountId: '', accountName: '', ref: '', debit: 0, credit: 0 },
      { id: '2', accountId: '', accountName: '', ref: '', debit: 0, credit: 0 }
    ]);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      {/* Header with School Branding */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#006837] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-[#F9A825]">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#006837] tracking-tight">AL SYUKRO UNIVERSAL</h1>
              <p className="text-sm font-medium text-[#F9A825] uppercase tracking-widest">Islamic School & Accounting Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F3F4F6] px-4 py-2 rounded-full border border-[#D1D5DB]">
            <Calculator className="text-[#006837]" size={20} />
            <span className="font-semibold text-sm">KALKULATOR JURNAL UMUM</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Entry */}
        <section className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText size={20} className="text-[#006837]" />
                Input Jurnal Baru
              </h2>
              <div className="text-xs font-mono bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                DRAFT #{Date.now().toString().slice(-4)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1">Tanggal</label>
                  <input 
                    type="date" 
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1">Keterangan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Setoran Modal"
                    value={currentDescription}
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-[#9CA3AF] uppercase px-2">
                  <div className="col-span-5">Akun</div>
                  <div className="col-span-1">Ref</div>
                  <div className="col-span-3">Debit</div>
                  <div className="col-span-3 text-right">Kredit</div>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-12 gap-2 items-center bg-[#F9FAFB] p-2 rounded-lg border border-[#F3F4F6] relative group"
                    >
                      <div className="col-span-5">
                        <select 
                          value={item.accountId}
                          onChange={(e) => updateItem(item.id, 'accountId', e.target.value)}
                          className="w-full bg-transparent text-sm font-medium outline-none"
                        >
                          <option value="">Pilih Akun...</option>
                          {DEFAULT_ACCOUNTS.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.code} - {acc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <span className="text-[10px] font-mono text-[#6B7280]">{item.ref || '-'}</span>
                      </div>
                      <div className="col-span-3">
                        <input 
                          type="number" 
                          placeholder="0"
                          value={item.debit || ''}
                          onChange={(e) => updateItem(item.id, 'debit', Number(e.target.value))}
                          className="w-full bg-white border border-[#E5E7EB] rounded px-2 py-1 text-sm text-right focus:border-[#006837] outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input 
                          type="number" 
                          placeholder="0"
                          value={item.credit || ''}
                          onChange={(e) => updateItem(item.id, 'credit', Number(e.target.value))}
                          className="w-full bg-white border border-[#E5E7EB] rounded px-2 py-1 text-sm text-right focus:border-[#006837] outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute -right-1 -top-1 bg-white border border-red-200 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={addItem}
                  className="w-full py-2 border-2 border-dashed border-[#D1D5DB] text-[#4B5563] text-sm font-medium rounded-lg hover:border-[#006837] hover:text-[#006837] transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Tambah Baris Akun
                </button>
              </div>

              {/* Total & Balance Check */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB] space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#6B7280]">TOTAL DEBIT</span>
                  <span className="text-[#006837]">{formatCurrency(totalDebit)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#6B7280]">TOTAL KREDIT</span>
                  <span className="text-[#1A1A1A]">{formatCurrency(totalCredit)}</span>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  isBalanced 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  {isBalanced ? (
                    <>
                      <CheckCircle2 size={18} />
                      Jurnal Seimbang (Balanced)
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
                      {totalDebit !== totalCredit 
                        ? `Selisih: ${formatCurrency(Math.abs(totalDebit - totalCredit))}`
                        : 'Masukkan nilai debit/kredit'}
                    </>
                  )}
                </div>

                <button 
                  onClick={handleSaveEntry}
                  disabled={!isBalanced}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isBalanced 
                      ? 'bg-[#006837] text-white hover:bg-[#004d29] shadow-md shadow-[#006837]/20 active:scale-[0.98]' 
                      : 'bg-[#D1D5DB] text-white cursor-not-allowed'
                  }`}
                >
                  <Save size={20} /> Simpan ke Buku Besar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: History table */}
        <section className="lg:col-span-12 xl:col-span-7">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm min-h-[600px] flex flex-col">
            <div className="px-6 py-6 border-b border-[#F3F4F6] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">JURNAL UMUM</h2>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-tight">Riwayat Pencatatan Akuntansi</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#006837] border border-[#006837] rounded-lg hover:bg-[#006837] hover:text-white transition-all">
                  <Download size={14} /> EXPORT
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-[#F9FAFB] text-[#6B7280] font-bold uppercase text-[10px] tracking-widest border-y border-[#F3F4F6]">
                  <tr>
                    <th className="px-4 py-3 text-left w-24">Tanggal</th>
                    <th className="px-4 py-3 text-left">Akun & Keterangan</th>
                    <th className="px-4 py-3 text-center w-20">Ref</th>
                    <th className="px-4 py-3 text-right w-32">Debit (Rp)</th>
                    <th className="px-4 py-3 text-right w-32">Kredit (Rp)</th>
                    <th className="px-4 py-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <RefreshCcw size={48} />
                          <p className="font-semibold italic font-serif">Belum ada data jurnal tercatat</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry) => (
                      <React.Fragment key={entry.id}>
                        {/* Entry Header/Description */}
                        <tr className="bg-gray-50/50">
                          <td className="px-4 py-2 text-xs font-bold text-[#006837]">{entry.date}</td>
                          <td colSpan={4} className="px-4 py-2 italic text-xs text-gray-500">{entry.description}</td>
                          <td className="px-4 py-2 text-right">
                            <button 
                              onClick={() => deleteEntry(entry.id)}
                              className="text-red-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                        {/* Entry Rows */}
                        {entry.items.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-[#FDFCF8] transition-colors">
                            <td className="px-4 py-3"></td>
                            <td className={`px-4 py-3 font-medium ${item.credit > 0 ? 'pl-10' : ''}`}>
                              {item.accountName}
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-mono text-gray-400">
                              {item.ref}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs">
                              {item.debit > 0 ? formatCurrency(item.debit) : ''}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs">
                              {item.credit > 0 ? formatCurrency(item.credit) : ''}
                            </td>
                            <td></td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            {entries.length > 0 && (
              <div className="bg-[#006837] text-white p-6 rounded-b-2xl">
                <div className="flex justify-between items-end border-t border-white/20 pt-4">
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Total Akumulasi</p>
                    <p className="text-sm font-medium italic opacity-80">Saldo Jurnal Berjalan</p>
                  </div>
                  <div className="flex gap-12">
                    <div className="text-right">
                      <p className="text-[10px] font-bold opacity-60 uppercase">DEBIT</p>
                      <p className="text-xl font-bold tracking-tighter">
                        {formatCurrency(entries.reduce((total, e) => total + e.items.reduce((sum, i) => sum + i.debit, 0), 0))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold opacity-60 uppercase">KREDIT</p>
                      <p className="text-xl font-bold tracking-tighter">
                        {formatCurrency(entries.reduce((total, e) => total + e.items.reduce((sum, i) => sum + i.credit, 0), 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center text-[#9CA3AF] text-xs">
        <p className="font-bold uppercase tracking-widest mb-2 text-[#006837]/40">Al Syukro Universal Accounting Systems</p>
        <p>© 2026 Perguruan Islam Al Syukro Universal. All Rights Reserved.</p>
        <p className="mt-1">Menciptakan Generas Cerdas, Berakhlak Mulia, dan Berintegritas.</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #006837;
        }
      `}</style>
    </div>
  );
}
