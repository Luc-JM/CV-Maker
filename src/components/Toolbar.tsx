import React, { useState, useRef, useEffect } from 'react';
import { CVConfig, TemplateType, FontType, SpacingType } from '../types';
import {
  Download,
  RotateCcw,
  Trash2,
  Code,
  Check,
  Type,
  Maximize2,
  Palette,
  Layout,
  Loader2,
  Printer,
  ChevronDown,
  History,
} from 'lucide-react';

interface ToolbarProps {
  config: CVConfig;
  onChangeConfig: (newConfig: CVConfig) => void;
  onResetDefault: () => void;
  onClearData: () => void;
  onOpenExportModal: () => void;
  onOpenHistoryModal: () => void;
  onPrint: () => void;
  onDownloadDirectPdf: () => void;
  isGeneratingPdf?: boolean;
  pdfStatus?: string;
  historyCount?: number;
}

const COLOR_PRESETS = [
  { name: 'Marineblauw (Circulair)', value: '#254d7e' },
  { name: 'Smaragdgroen', value: '#0f766e' },
  { name: 'Bordeauxrood', value: '#881337' },
  { name: 'Leisteengrijs', value: '#334155' },
  { name: 'Koningsblauw', value: '#1d4ed8' },
  { name: 'Warm Terracotta', value: '#c2410c' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  config,
  onChangeConfig,
  onResetDefault,
  onClearData,
  onOpenExportModal,
  onOpenHistoryModal,
  onPrint,
  onDownloadDirectPdf,
  isGeneratingPdf = false,
  pdfStatus = '',
  historyCount = 0,
}) => {
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowPrintMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const templates: { id: TemplateType; label: string; badge?: string }[] = [
    { id: 'circulair', label: 'Circulair', badge: 'Voorbeeld' },
    { id: 'modern', label: 'Modern' },
    { id: 'luxe', label: 'Luxe' },
    { id: 'professioneel', label: 'Professioneel' },
  ];

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Titel */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-wider">
              CV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base">CV Maker</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Vibe Coding
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Minimalistische split-screen editor met directe A4 preview
              </p>
            </div>
          </div>

          {/* Template Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 px-2 flex items-center gap-1.5 hidden md:flex">
              <Layout className="w-3.5 h-3.5" />
              <span>Sjabloon:</span>
            </div>
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => onChangeConfig({ ...config, template: tpl.id })}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  config.template === tpl.id
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{tpl.label}</span>
                {tpl.badge && (
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-semibold">
                    {tpl.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Actieknoppen rechts */}
          <div className="flex items-center gap-2">
            {/* Geschiedenis Knop */}
            <button
              onClick={onOpenHistoryModal}
              title="Bekijk eerdere versies en geschiedenis van je CV"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Geschiedenis</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenExportModal}
              title="Bekijk of download standalone single-file HTML"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
            >
              <Code className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden lg:inline">Single-File HTML</span>
            </button>

            {/* PDF Actie knoppengroep */}
            <div className="relative inline-flex items-center rounded-lg shadow-xs" ref={menuRef}>
              <button
                onClick={onDownloadDirectPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-l-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white shadow-xs transition active:scale-[0.98] cursor-pointer"
                title="Download CV direct als A4 PDF bestand (.pdf)"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isGeneratingPdf ? (pdfStatus || 'Bezig...') : 'Download PDF'}</span>
              </button>

              <button
                onClick={() => setShowPrintMenu((prev) => !prev)}
                disabled={isGeneratingPdf}
                aria-label="Export opties tonen"
                className="px-1.5 py-1.5 rounded-r-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white border-l border-blue-500/50 transition cursor-pointer"
                title="Meer opties"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {showPrintMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      setShowPrintMenu(false);
                      onDownloadDirectPdf();
                    }}
                    disabled={isGeneratingPdf}
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-slate-800 hover:text-blue-700 flex items-start gap-2.5 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">
                        Directe PDF download <span className="text-[10px] text-blue-600 font-bold bg-blue-100 px-1 py-0.2 rounded ml-1">Aanbevolen</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 mt-0.5">
                        Downloadt direct een kant-en-klaar 1-pagina A4 PDF-bestand
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowPrintMenu(false);
                      onPrint();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-700 flex items-start gap-2.5 transition cursor-pointer border-t border-slate-100"
                  >
                    <Printer className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">
                        Afdrukken via browser
                      </div>
                      <div className="text-[10.5px] text-slate-500 mt-0.5">
                        Opent afdrukdialoog (werkt alleen buiten sandboxed iframes)
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tweede sub-balk: Styling opties (Kleur, Font, Marges, Reset) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Accentkleuren */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                <span>Kleur:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => onChangeConfig({ ...config, accentColor: preset.value })}
                    title={preset.name}
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer relative"
                    style={{ backgroundColor: preset.value }}
                  >
                    {config.accentColor.toLowerCase() === preset.value.toLowerCase() && (
                      <Check className="w-3 h-3 text-white drop-shadow-xs" />
                    )}
                  </button>
                ))}
                {/* Custom Color Picker */}
                <div className="relative flex items-center ml-1">
                  <input
                    type="color"
                    id="custom-color-picker"
                    value={config.accentColor}
                    onChange={(e) => onChangeConfig({ ...config, accentColor: e.target.value })}
                    className="w-5 h-5 rounded-full border border-slate-300 p-0 cursor-pointer overflow-hidden opacity-0 absolute"
                  />
                  <label
                    htmlFor="custom-color-picker"
                    className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-500 bg-white hover:bg-slate-50 cursor-pointer"
                    title="Aangepaste kleur kiezen"
                  >
                    +
                  </label>
                </div>
              </div>
            </div>

            {/* Lettertype */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-slate-400" />
                <span>Font:</span>
              </span>
              <select
                value={config.font}
                onChange={(e) => onChangeConfig({ ...config, font: e.target.value as FontType })}
                className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="sans">Sans-Serif (Inter)</option>
                <option value="serif">Serif (Klassiek / Merriweather)</option>
                <option value="display">Modern Display (Plus Jakarta)</option>
              </select>
            </div>

            {/* Marges / Spatiëring */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Marges:</span>
              </span>
              <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200">
                {(['compact', 'normal', 'spacious'] as SpacingType[]).map((sp) => (
                  <button
                    key={sp}
                    onClick={() => onChangeConfig({ ...config, spacing: sp })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                      config.spacing === sp
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {sp === 'compact' ? 'Compact' : sp === 'normal' ? 'Normaal' : 'Ruim'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset / Leegmaken links */}
          <div className="flex items-center gap-3">
            <button
              onClick={onResetDefault}
              className="text-slate-500 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer"
              title="Herstel het standaard voorbeeld CV"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Voorbeeld herstellen</span>
            </button>

            <span className="text-slate-300">|</span>

            <button
              onClick={onClearData}
              className="text-slate-500 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
              title="Verwijder alle ingevoerde gegevens"
            >
              <Trash2 className="w-3 h-3" />
              <span>Leegmaken</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
