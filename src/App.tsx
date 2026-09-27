/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CVData, CVConfig } from './types';
import { DEFAULT_CV_DATA, DEFAULT_CONFIG, BLANK_CV_DATA } from './defaultData';
import { Toolbar } from './components/Toolbar';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { ExportHtmlModal } from './components/ExportHtmlModal';
import { downloadCvAsPdf, triggerNativePrint } from './utils/pdfGenerator';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const STORAGE_KEY_DATA = 'cv_maker_pro_data_v1';
const STORAGE_KEY_CONFIG = 'cv_maker_pro_config_v1';

export default function App() {
  // Initialize data with localStorage fallback
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

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Auto-save to localStorage whenever data or config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    } catch (e) {
      console.error('Could not save data to localStorage', e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Could not save config to localStorage', e);
    }
  }, [config]);

  // Actions
  const handleResetDefault = () => {
    if (window.confirm('Wil je het standaard voorbeeld (Luc Meijerink) herstellen?')) {
      setData(DEFAULT_CV_DATA);
      setConfig(DEFAULT_CONFIG);
      showToast('Standaard voorbeeld hersteld');
    }
  };

  const handleClearData = () => {
    if (window.confirm('Weet je zeker dat je alle gegevens wilt leegmaken?')) {
      setData(BLANK_CV_DATA);
      showToast('Formulier leeggemaakt');
    }
  };

  // Primaire oplossing: Native Print to PDF via window.print()
  const handlePrintPDF = () => {
    showToast('Afdrukvenster geopend. Kies "Opslaan als PDF" in uw browser.', 'success');
    setTimeout(() => {
      const result = triggerNativePrint();
      if (!result.success) {
        showToast(
          'Afdrukvenster geblokkeerd in deze iframe. We downloaden het bestand direct...',
          'error'
        );
        handleDownloadDirectPdf();
      }
    }, 150);
  };

  // Directe PDF download (jsPDF + html-to-image met native browser SVG/canvas rendering)
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
      showToast('Kon PDF niet automatisch genereren. We openen het afdrukvenster...', 'error');
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
        onPrint={handlePrintPDF}
        onDownloadDirectPdf={handleDownloadDirectPdf}
        isGeneratingPdf={isGeneratingPdf}
        pdfStatus={pdfStatus}
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

      {/* Toast Notificatie */}
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
    </div>
  );
}
