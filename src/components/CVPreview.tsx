import React, { useState } from 'react';
import { CVData, CVConfig } from '../types';
import { CirculairTemplate } from './templates/CirculairTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { LuxeTemplate } from './templates/LuxeTemplate';
import { ProfessioneelTemplate } from './templates/ProfessioneelTemplate';
import { ZoomIn, ZoomOut, Eye, Download, Loader2 } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
  config: CVConfig;
  onPrint: () => void;
  onDownloadDirectPdf?: () => void;
  isGeneratingPdf?: boolean;
  pdfStatus?: string;
}

export const CVPreview: React.FC<CVPreviewProps> = ({
  data,
  config,
  onPrint,
  onDownloadDirectPdf,
  isGeneratingPdf = false,
  pdfStatus = '',
}) => {
  const [zoom, setZoom] = useState<number>(0.85); // 85% default fits nicely on typical screens

  const renderTemplate = () => {
    switch (config.template) {
      case 'circulair':
        return <CirculairTemplate data={data} config={config} />;
      case 'modern':
        return <ModernTemplate data={data} config={config} />;
      case 'luxe':
        return <LuxeTemplate data={data} config={config} />;
      case 'professioneel':
        return <ProfessioneelTemplate data={data} config={config} />;
      default:
        return <CirculairTemplate data={data} config={config} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-200/70 overflow-hidden relative">
      {/* Preview Topbar / Status & Zoom */}
      <div className="no-print bg-white/90 backdrop-blur-xs border-b border-slate-200 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          <span>Live A4 Weergave</span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
            {config.template.toUpperCase()}
          </span>
          {isGeneratingPdf && (
            <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{pdfStatus || 'PDF genereren...'}</span>
            </span>
          )}
        </div>

        {/* Zoom controls & Download button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(2))))}
              title="Uitzoomen"
              className="p-1 hover:bg-white rounded text-slate-600 transition cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-700 select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.2, Number((z + 0.1).toFixed(2))))}
              title="Inzoomen"
              className="p-1 hover:bg-white rounded text-slate-600 transition cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setZoom(0.85)}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition cursor-pointer"
          >
            Reset
          </button>

          <button
            onClick={onDownloadDirectPdf || onPrint}
            disabled={isGeneratingPdf}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-3 py-1 rounded-md transition shadow-xs cursor-pointer"
            title="Download CV direct als A4 PDF bestand (.pdf)"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
            <span>{isGeneratingPdf ? (pdfStatus || 'Bezig...') : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Preview Scrollable Canvas */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start print-page-wrapper">
        <div
          className="transition-transform origin-top flex justify-center"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: '210mm',
          }}
        >
          {/* Target ID for PDF Generator */}
          <div id="cv-preview-a4" className="w-full">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
