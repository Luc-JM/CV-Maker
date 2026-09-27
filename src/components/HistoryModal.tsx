import React, { useState } from 'react';
import { CVHistoryItem, CVData, CVConfig } from '../types';
import {
  X,
  History,
  RotateCcw,
  Trash2,
  BookmarkPlus,
  Clock,
  Eye,
  Download,
  Upload,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  Search,
  Check,
  Edit2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CVHistoryItem[];
  currentData: CVData;
  currentConfig: CVConfig;
  onRestore: (item: CVHistoryItem) => void;
  onSaveSnapshot: (label?: string) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onRenameItem: (id: string, newLabel: string) => void;
  onImportHistory: (imported: CVHistoryItem[]) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  currentData,
  currentConfig,
  onRestore,
  onSaveSnapshot,
  onDeleteHistoryItem,
  onClearHistory,
  onRenameItem,
  onImportHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLabelInput, setNewLabelInput] = useState('');
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [previewItem, setPreviewItem] = useState<CVHistoryItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabelValue, setEditLabelValue] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [importStatus, setImportStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('nl-NL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Onbekende datum';
    }
  };

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(term);
    const labelMatch = item.label?.toLowerCase().includes(term);
    const roleMatch = item.subtitle?.toLowerCase().includes(term);
    const templateMatch = item.config?.template?.toLowerCase().includes(term);
    return titleMatch || labelMatch || roleMatch || templateMatch;
  });

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSnapshot(newLabelInput.trim() || undefined);
    setNewLabelInput('');
    setIsCreatingSnapshot(false);
  };

  const handleStartRename = (item: CVHistoryItem) => {
    setEditingId(item.id);
    setEditLabelValue(item.label || '');
  };

  const handleSaveRename = (id: string) => {
    if (editLabelValue.trim()) {
      onRenameItem(id, editLabelValue.trim());
    }
    setEditingId(null);
  };

  // Export entire history as a JSON file
  const handleExportJson = () => {
    const jsonString = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-maker-geschiedenis-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportHistory(parsed);
          setImportStatus({ message: `${parsed.length} versies succesvol geïmporteerd!` });
        } else {
          setImportStatus({
            message: 'Ongeldig bestand: verwacht een lijst van versies.',
            isError: true,
          });
        }
      } catch {
        setImportStatus({
          message: 'Fout bij het inlezen van het bestand. Zorg voor een geldig .json bestand.',
          isError: true,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Geschiedenis & Versiebeheer</span>
                <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {history.length} {history.length === 1 ? 'versie' : 'versies'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Al je wijzigingen en snapshots veilig opgeslagen in jouw lokale browser-opslag
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Acties binnen modal */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zoek op naam, functie of label..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCreatingSnapshot(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer whitespace-nowrap"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Snapshot Maken</span>
            </button>
          </div>

          {/* Import / Export & Wis acties */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={handleExportJson}
              disabled={history.length === 0}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer border border-slate-200"
              title="Download alle versies als JSON bestand"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Back-up exporteren</span>
            </button>

            <label
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer border border-slate-200"
              title="Herstel versies vanuit een eerder geëxporteerd JSON bestand"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Importeren</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            {history.length > 0 && (
              isClearingAll ? (
                <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg ml-1">
                  <span className="text-[11px] text-rose-700 font-medium">Alles wissen?</span>
                  <button
                    onClick={() => {
                      onClearHistory();
                      setIsClearingAll(false);
                    }}
                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded cursor-pointer"
                  >
                    Ja
                  </button>
                  <button
                    onClick={() => setIsClearingAll(false)}
                    className="px-1.5 py-0.5 text-slate-500 hover:text-slate-800 text-[10px] cursor-pointer"
                  >
                    Nee
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsClearingAll(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-1"
                  title="Alle geschiedenis wissen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Status melding bij importeren */}
        {importStatus && (
          <div
            className={`px-4 py-2.5 text-xs flex items-center justify-between border-b ${
              importStatus.isError
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span>{importStatus.message}</span>
            <button onClick={() => setImportStatus(null)} className="p-0.5 text-slate-400 hover:text-slate-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Snapshot Maken Formulier */}
        {isCreatingSnapshot && (
          <form
            onSubmit={handleCreateSnapshot}
            className="p-4 bg-blue-50/70 border-b border-blue-200 animate-in fade-in flex-shrink-0 flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <input
                type="text"
                value={newLabelInput}
                onChange={(e) => setNewLabelInput(e.target.value)}
                placeholder="Bijv. Versie voor sollicitatie Marketing, of Vóór aanpassingen..."
                autoFocus
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
              >
                Opslaan
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingSnapshot(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-blue-100/60 cursor-pointer"
              >
                Annuleren
              </button>
            </div>
          </form>
        )}

        {/* Hoofdinhoud: Lijst met versies of Detail Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/50">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Geen opgeslagen versies gevonden</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchTerm
                    ? 'Geen versies die overeenkomen met je zoekopdracht.'
                    : 'Er zijn nog geen versies in je geschiedenis. Maak een snapshot om de huidige status van je CV vast te leggen!'}
                </p>
              </div>
              {!searchTerm && (
                <button
                  onClick={() => setIsCreatingSnapshot(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Eerste snapshot vastleggen</span>
                </button>
              )}
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isCurrent =
                JSON.stringify(item.data) === JSON.stringify(currentData) &&
                JSON.stringify(item.config) === JSON.stringify(currentConfig);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all p-4 shadow-2xs hover:shadow-sm ${
                    isCurrent
                      ? 'border-blue-300 ring-1 ring-blue-500/20 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Linkerkant: Info over de versie */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editLabelValue}
                              onChange={(e) => setEditLabelValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(item.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              autoFocus
                              className="px-2 py-0.5 text-xs rounded border border-blue-400 bg-white font-medium"
                            />
                            <button
                              onClick={() => handleSaveRename(item.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                              {item.label || item.title || 'Naamloos CV'}
                            </span>
                            <button
                              onClick={() => handleStartRename(item)}
                              title="Label aanpassen"
                              className="p-1 text-slate-300 hover:text-slate-600 rounded transition cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {isCurrent && (
                          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Huidige Actieve Versie
                          </span>
                        )}

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            item.type === 'manual'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.type === 'manual' ? 'Handmatige snapshot' : 'Automatische back-up'}
                        </span>
                      </div>

                      {/* Kandidaat info & Template badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">
                          {item.title || 'Geen naam ingevuld'}
                        </span>
                        {item.subtitle && <span>• {item.subtitle}</span>}
                        <span>•</span>
                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.config.accentColor }}
                          />
                          <span className="capitalize font-medium text-slate-700">
                            {item.config.template}
                          </span>
                        </div>
                      </div>

                      {/* Statussen & Telling */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.timestamp)}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          <span>{item.data.experience?.length || 0} werkervaringen</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          <span>{item.data.education?.length || 0} opleidingen</span>
                        </span>
                      </div>
                    </div>

                    {/* Rechterkant: Knoppen voor Herstellen / Bekijken / Verwijderen */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                        title="Bekijk de inhoud van deze versie"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Bekijken</span>
                      </button>

                      <button
                        onClick={() => {
                          onRestore(item);
                          onClose();
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        title="Herstel deze versie in de editor"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Herstellen</span>
                      </button>

                      {deletingId === item.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
                          <span className="text-[11px] text-rose-700 font-medium">Verwijderen?</span>
                          <button
                            onClick={() => {
                              onDeleteHistoryItem(item.id);
                              setDeletingId(null);
                            }}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded cursor-pointer"
                          >
                            Ja
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-1.5 py-0.5 text-slate-500 hover:text-slate-800 text-[10px] cursor-pointer"
                          >
                            Nee
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Versie verwijderen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Lokale browser opslag (geen externe database)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>

      {/* Mini Preview Modal voor geselecteerde versie */}
      {previewItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Inhoud van versie: {previewItem.label || previewItem.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Opgeslagen op {formatDate(previewItem.timestamp)} • Sjabloon: {previewItem.config.template}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Personalia */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 text-sm">
                  {previewItem.data.personal.fullName || 'Naamloos'}
                </div>
                <div className="text-blue-700 font-medium">
                  {previewItem.data.personal.title || 'Geen functietitel'}
                </div>
                <div className="text-slate-500 text-[11px] flex flex-wrap gap-2 pt-1">
                  <span>{previewItem.data.personal.email || 'Geen email'}</span>
                  <span>•</span>
                  <span>{previewItem.data.personal.phone || 'Geen telefoon'}</span>
                  {previewItem.data.personal.postalCodeCity && (
                    <>
                      <span>•</span>
                      <span>{previewItem.data.personal.postalCodeCity}</span>
                    </>
                  )}
                </div>
                {previewItem.data.personal.summary && (
                  <p className="text-slate-600 pt-2 border-t border-slate-200 mt-2 text-[11.5px] leading-relaxed">
                    {previewItem.data.personal.summary}
                  </p>
                )}
              </div>

              {/* Werkervaring */}
              <div>
                <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-2">
                  Werkervaring ({previewItem.data.experience.length})
                </h5>
                <div className="space-y-2">
                  {previewItem.data.experience.map((exp, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-2.5 bg-white">
                      <div className="font-bold text-slate-800 flex justify-between">
                        <span>{exp.role || 'Rol'}</span>
                        <span className="text-[11px] text-slate-500 font-normal">{exp.period}</span>
                      </div>
                      <div className="text-slate-600 text-[11.5px]">{exp.company}</div>
                      {exp.description && (
                        <p className="text-slate-500 text-[11px] mt-1 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Opleidingen */}
              <div>
                <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-2">
                  Opleidingen ({previewItem.data.education.length})
                </h5>
                <div className="space-y-2">
                  {previewItem.data.education.map((edu, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-2.5 bg-white">
                      <div className="font-bold text-slate-800 flex justify-between">
                        <span>{edu.title || 'Studie'}</span>
                        <span className="text-[11px] text-slate-500 font-normal">{edu.period}</span>
                      </div>
                      <div className="text-slate-600 text-[11.5px]">{edu.institution}</div>
                      {edu.description && (
                        <p className="text-slate-500 text-[11px] mt-1 whitespace-pre-line">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vaardigheden & Hobby's */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="font-bold text-slate-700 mb-1 text-[11px]">Vaardigheden</div>
                  <div className="flex flex-wrap gap-1">
                    {previewItem.data.skills.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="font-bold text-slate-700 mb-1 text-[11px]">Hobby's & Interesses</div>
                  <div className="flex flex-wrap gap-1">
                    {previewItem.data.hobbies.map((h, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setPreviewItem(null)}
                className="text-xs text-slate-600 hover:text-slate-900"
              >
                Terug naar lijst
              </button>

              <button
                onClick={() => {
                  onRestore(previewItem);
                  setPreviewItem(null);
                  onClose();
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Deze versie herstellen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
