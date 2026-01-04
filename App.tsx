
import React, { useState, useMemo, useEffect } from 'react';
import { CalculationRow } from './types';
import InputGroup from './components/InputGroup';
import { getWoodAdvice } from './services/geminiService';

const App: React.FC = () => {
  // Current inputs
  const [n1, setN1] = useState<string>('');
  const [n2, setN2] = useState<string>('');
  const [n3, setN3] = useState<string>('');
  const [n4, setN4] = useState<string>('');

  // History of calculations
  const [history, setHistory] = useState<CalculationRow[]>([]);
  
  // AI Advice state
  const [advice, setAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);

  // Calculate cumulative total
  const totalResult = useMemo(() => {
    return history.reduce((sum, item) => sum + item.result, 0);
  }, [history]);

  const handleAddCalculation = () => {
    const v1 = parseFloat(n1);
    const v2 = parseFloat(n2);
    const v3 = parseFloat(n3);
    const v4 = parseFloat(n4);

    if (isNaN(v1) || isNaN(v2) || isNaN(v3) || isNaN(v4)) {
      alert("Please enter valid numbers for all four inputs.");
      return;
    }

    const result = (v1 * v2 * v3 * v4) / 144;
    
    const newRow: CalculationRow = {
      id: Math.random().toString(36).substr(2, 9),
      n1: v1,
      n2: v2,
      n3: v3,
      n4: v4,
      result,
      timestamp: Date.now()
    };

    setHistory([newRow, ...history]);
    
    // Reset inputs
    setN1('');
    setN2('');
    setN3('');
    setN4('');
  };

  const removeRow = (id: string) => {
    setHistory(history.filter(row => row.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Clear all calculations?")) {
      setHistory([]);
      setAdvice('');
    }
  };

  const fetchAIAdvice = async () => {
    if (totalResult === 0) return;
    setIsLoadingAdvice(true);
    const res = await getWoodAdvice(totalResult);
    setAdvice(res);
    setIsLoadingAdvice(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <h1 className="text-xl font-bold text-slate-800">TimberTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 hidden sm:inline">Total Units:</span>
            <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-mono font-bold text-lg border border-amber-100">
              {totalResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Input Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">New Calculation</h2>
            <p className="text-sm text-slate-500">Formula: (L × W × T × Qty) / 144</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputGroup label="Length" value={n1} onChange={setN1} placeholder="0" />
              <InputGroup label="Width" value={n2} onChange={setN2} placeholder="0" />
              <InputGroup label="Thickness" value={n3} onChange={setN3} placeholder="0" />
              <InputGroup label="Quantity" value={n4} onChange={setN4} placeholder="1" />
            </div>
            <button 
              onClick={handleAddCalculation}
              className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add to Total
            </button>
          </div>
        </section>

        {/* Action Bar */}
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Calculation History</h3>
          <div className="flex gap-2">
             <button 
              onClick={fetchAIAdvice}
              disabled={history.length === 0 || isLoadingAdvice}
              className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isLoadingAdvice ? 'Thinking...' : 'AI Insights'}
            </button>
            <button 
              onClick={clearHistory}
              disabled={history.length === 0}
              className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* AI Insight Box */}
        {advice && (
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500/30 p-2 rounded-lg">
                <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-indigo-100 mb-2">Wood Expert Insights</h4>
                <div className="text-sm leading-relaxed text-indigo-50/90 whitespace-pre-line">
                  {advice}
                </div>
              </div>
              <button onClick={() => setAdvice('')} className="text-indigo-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-400">No calculations yet. Start adding items above.</p>
            </div>
          ) : (
            history.map((row, index) => (
              <div 
                key={row.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-800">Measurement #{history.length - index}</span>
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                      {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>{row.n1} × {row.n2} × {row.n3} × {row.n4}</span>
                    <span className="text-slate-300">/ 144</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-800 font-mono">
                      {row.result.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Units</div>
                  </div>
                  <button 
                    onClick={() => removeRow(row.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Footer (Mobile Only Shortcut) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:hidden flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-tighter leading-none mb-1">Grand Total</span>
          <span className="text-xl font-mono font-bold text-amber-600 leading-none">
            {totalResult.toFixed(2)}
          </span>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-slate-800 text-white p-3 rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;
