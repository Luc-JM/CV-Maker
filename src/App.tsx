/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CVData, CVConfig, CVHistoryItem } from './types';
import { DEFAULT_CV_DATA, DEFAULT_CONFIG, BLANK_CV_DATA } from './defaultData';
import { Toolbar } from './components/Toolbar';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { ExportHtmlModal } from './components/ExportHtmlModal';
import { HistoryModal } from './components/HistoryModal';
import { ConfirmModal } from './components/ConfirmModal';
import { downloadCvAsPdf, triggerNativePrint } from './utils/pdfGenerator';
import { CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';

const STORAGE_KEY_DATA = 'cv_maker_pro_data_v1';
const STORAGE_KEY_CONFIG = 'cv_maker_pro_config_v1';
const STORAGE_KEY_HISTORY = 'cv_maker_history_v1';

export default function App() {
  // Initialize data with localStorage fallback
  // This keeps the user's private data safely in their personal browser localStorage
  const [data, setData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
    return DEFAULT_CV_DATA;
  });

  // Initialize config with localStorage fallback
  const [config, setConfig] = useState<CVConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  // History / Versiebeheer storage
  const [history, setHistory] = useState<CVHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading history from localStorage', e);
    }
    return [];
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState('');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    undoAction?: () => void;
  } | null>(null);

  // In-app confirmation dialog state (replaces window.confirm)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'clear' | 'reset';
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'danger' | 'warning';
  } | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success',
    undoAction?: () => void
  ) => {
    setToast({ message, type, undoAction });
    setTimeout(() => setToast(null), 5500);
  };

  // Auto-save active CV data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    } catch (e) {
      console.error('Could not save data to localStorage', e);
    }
  }, [data]);

  // Auto-save active config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Could not save config to localStorage', e);
    }
  }, [config]);

  // Auto-save history list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Could not save history to localStorage', e);
    }
  }, [history]);

  // Initial history snapshot: Ensure the user's existing work is backed up in history if history is empty
  useEffect(() => {
    if (history.length === 0 && data.personal?.fullName) {
      const initialSnapshot: CVHistoryItem = {
        id: 'initial-' + Date.now(),
        timestamp: Date.now(),
        title: data.personal.fullName,
        subtitle: data.personal.title,
        label: 'Initiële versie uit lokale opslag',
        data: JSON.parse(JSON.stringify(data)),
        config: JSON.parse(JSON.stringify(config)),
        type: 'auto',
      };
      setHistory([initialSnapshot]);
    }
  }, []); // Run once on mount

  // Debounced auto-save to history when significant edits are made (every 45 seconds of activity)
  useEffect(() => {
    const timer = setTimeout(() => {
      const latest = history[0];
      const hasChanged =
        !latest ||
        JSON.stringify(latest.data) !== JSON.stringify(data) ||
        JSON.stringify(latest.config) !== JSON.stringify(config);

      if (hasChanged && data.personal?.fullName) {
        const autoSnapshot: CVHistoryItem = {
          id: 'auto-' + Date.now(),
          timestamp: Date.now(),
          title: data.personal.fullName || 'Mijn CV',
          subtitle: data.personal.title,
          label: 'Automatische back-up',
          data: JSON.parse(JSON.stringify(data)),
          config: JSON.parse(JSON.stringify(config)),
          type: 'auto',
        };
        setHistory((prev) => [autoSnapshot, ...prev.slice(0, 24)]);
      }
    }, 45000);

    return () => clearTimeout(timer);
  }, [data, config, history]);

  // Manual snapshot action
  const handleSaveSnapshot = (customLabel?: string) => {
    const snapshot: CVHistoryItem = {
      id: 'manual-' + Date.now(),
      timestamp: Date.now(),
      title: data.personal?.fullName || 'Mijn CV',
      subtitle: data.personal?.title,
      label:
        customLabel ||
        `Handmatige snapshot (${new Date().toLocaleTimeString('nl-NL', {
          hour: '2-digit',
          minute: '2-digit',
        })})`,
      data: JSON.parse(JSON.stringify(data)),
      config: JSON.parse(JSON.stringify(config)),
      type: 'manual',
    };
    setHistory((prev) => [snapshot, ...prev.slice(0, 29)]);
    showToast(`Versie "${snapshot.label}" opgeslagen in geschiedenis!`, 'success');
  };

  // Restore a snapshot from history
  const handleRestoreHistory = (item: CVHistoryItem) => {
    setData(JSON.parse(JSON.stringify(item.data)));
    setConfig(JSON.parse(JSON.stringify(item.config)));
    showToast(`Versie "${item.label || item.title}" hersteld!`, 'success');
  };

  // Delete a history snapshot
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Versie verwijderd uit geschiedenis', 'success');
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    showToast('Geschiedenis volledig gewist', 'success');
  };

  // Rename a history snapshot
  const handleRenameHistoryItem = (id: string, newLabel: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
    showToast('Label aangepast', 'success');
  };

  // Import history backup
  const handleImportHistory = (imported: CVHistoryItem[]) => {
    setHistory(imported);
    showToast(`${imported.length} versies succesvol geïmporteerd!`, 'success');
  };

  // Reset to neutral default sample via in-app confirmation
  const handleResetDefault = () => {
    setConfirmAction({
      type: 'reset',
      title: 'Standaard voorbeeld herstellen?',
      message:
        'Weet je zeker dat je het standaard voorbeeld wilt herstellen? Alle velden worden vervangen door het neutrale voorbeeldprofiel.',
      confirmLabel: 'Ja, voorbeeld herstellen',
      variant: 'warning',
    });
  };

  // Clear form via in-app confirmation
  const handleClearData = () => {
    setConfirmAction({
      type: 'clear',
      title: 'Formulier volledig leegmaken?',
      message:
        'Weet je zeker dat je alle gegevens wilt leegmaken? Alle invoervelden voor personalia, werkervaring en opleidingen worden gewist.',
      confirmLabel: 'Ja, formulier leegmaken',
      variant: 'danger',
    });
  };

  // Execute confirmed action (replaces window.confirm)
  const executeConfirmAction = () => {
    if (!confirmAction) return;

    // Preserve previous state for instant undo
    const previousData = JSON.parse(JSON.stringify(data));
    const previousConfig = JSON.parse(JSON.stringify(config));

    if (confirmAction.type === 'clear') {
      if (data.personal?.fullName) {
        handleSaveSnapshot('Back-up vóór leegmaken');
      }
      setData(BLANK_CV_DATA);
      showToast(
        'Formulier leeggemaakt. Je kunt dit ongedaan maken!',
        'success',
        () => {
          setData(previousData);
          setConfig(previousConfig);
          showToast('Leegmaken ongedaan gemaakt', 'success');
        }
      );
    } else if (confirmAction.type === 'reset') {
      if (data.personal?.fullName) {
        handleSaveSnapshot('Back-up vóór herstel standaard voorbeeld');
      }
      setData(DEFAULT_CV_DATA);
      setConfig(DEFAULT_CONFIG);
      showToast(
        'Standaard voorbeeld hersteld.',
        'success',
        () => {
          setData(previousData);
          setConfig(previousConfig);
          showToast('Herstellen ongedaan gemaakt', 'success');
        }
      );
    }

    setConfirmAction(null);
  };

  // Native Print to PDF via window.print()
  const handlePrintPDF = () => {
    showToast('Afdrukvenster wordt geopend...', 'success');
    setTimeout(() => {
      const result = triggerNativePrint();
      if (!result.success) {
        showToast(
          'Afdrukvenster niet direct beschikbaar in dit venster. We downloaden de PDF direct...',
          'error'
        );
        handleDownloadDirectPdf();
      }
    }, 120);
  };

  // Direct PDF download (html-to-image + jsPDF, exact A4, guaranteed 1 page)
  const handleDownloadDirectPdf = async () => {
    if (isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setPdfStatus('PDF voorbereiden...');

    const cleanName = (data.personal.fullName || 'CV')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `CV_${cleanName}.pdf`;

    try {
      await downloadCvAsPdf({
        elementId: 'cv-preview-a4',
        fileName,
        onProgress: (status) => setPdfStatus(status),
      });
      showToast(`PDF succesvol gedownload: ${fileName}`, 'success');
    } catch (err: unknown) {
      console.error('Fout bij direct downloaden van PDF:', err);
      showToast('Kon PDF niet direct genereren. Probeer de browser print optie...', 'error');
      triggerNativePrint();
    } finally {
      setIsGeneratingPdf(false);
      setPdfStatus('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans relative">
      {/* Top Toolbar */}
      <Toolbar
        config={config}
        onChangeConfig={setConfig}
        onResetDefault={handleResetDefault}
        onClearData={handleClearData}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onPrint={handlePrintPDF}
        onDownloadDirectPdf={handleDownloadDirectPdf}
        isGeneratingPdf={isGeneratingPdf}
        pdfStatus={pdfStatus}
        historyCount={history.length}
      />

      {/* Split Screen Werkruimte */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Linkerhelft: Invoervelden & Formulier */}
        <div className="no-print w-full md:w-[460px] lg:w-[500px] flex-shrink-0 h-full overflow-hidden shadow-xs z-10">
          <CVForm data={data} onChange={setData} />
        </div>

        {/* Rechterhelft: Live A4 Preview */}
        <div className="flex-1 h-full overflow-hidden relative">
          <CVPreview
            data={data}
            config={config}
            onPrint={handlePrintPDF}
            onDownloadDirectPdf={handleDownloadDirectPdf}
            isGeneratingPdf={isGeneratingPdf}
            pdfStatus={pdfStatus}
          />
        </div>
      </div>

      {/* Toast Notificatie met optionele Ongedaan Maken knop */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border text-xs font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700 backdrop-blur-xs'
                : 'bg-rose-900/90 text-white border-rose-700 backdrop-blur-xs'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />
            )}
            <span>{toast.message}</span>

            {toast.undoAction && (
              <button
                onClick={() => {
                  toast.undoAction?.();
                  setToast(null);
                }}
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ml-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ongedaan maken</span>
              </button>
            )}

            <button
              onClick={() => setToast(null)}
              className="text-white/60 hover:text-white ml-1 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Standalone Single-File HTML Export Modal */}
      <ExportHtmlModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        config={config}
      />

      {/* Geschiedenis & Versiebeheer Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        currentData={data}
        currentConfig={config}
        onRestore={handleRestoreHistory}
        onSaveSnapshot={handleSaveSnapshot}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        onRenameItem={handleRenameHistoryItem}
        onImportHistory={handleImportHistory}
      />

      {/* Bevestigingsdialoog (geen browser-native window.confirm die faalt in iframes) */}
      {confirmAction && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={executeConfirmAction}
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          variant={confirmAction.variant}
          showBackupNotice={true}
        />
      )}
    </div>
  );
}
