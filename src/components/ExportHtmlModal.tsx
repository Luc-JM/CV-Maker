import React, { useState } from 'react';
import { CVData, CVConfig } from '../types';
import { X, Copy, Check, Download, ExternalLink } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
  config: CVConfig;
}

export const ExportHtmlModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  config,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate complete standalone single-file HTML
  const generateStandaloneHtml = (): string => {
    const serializedData = JSON.stringify(data, null, 2);
    const serializedConfig = JSON.stringify(config, null, 2);

    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV Maker – ${data.personal.fullName || 'Mijn CV'}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- html2pdf for direct PDF file download -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
    .font-serif-cv { font-family: 'Merriweather', serif; }
    .font-display-cv { font-family: 'Plus Jakarta Sans', sans-serif; }
    @page { size: A4 portrait; margin: 0; }
    @media print {
      body { background: white !important; margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
      .a4-page { width: 210mm !important; min-height: 297mm !important; box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased flex flex-col h-screen overflow-hidden">

  <!-- TOP TOOLBAR -->
  <header class="no-print bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-20">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">CV</div>
      <div>
        <h1 class="font-bold text-slate-900 text-sm leading-tight">CV Maker Single-Page</h1>
        <p class="text-[11px] text-slate-500">Volledig lokaal & direct printbaar naar A4</p>
      </div>
    </div>

    <!-- Template Selector -->
    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-500 font-medium">Sjabloon:</span>
      <select id="templateSelect" class="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800">
        <option value="circulair">Circulair (CV.nl)</option>
        <option value="modern">Modern</option>
        <option value="luxe">Luxe</option>
        <option value="professioneel">Professioneel</option>
      </select>

      <span class="text-xs text-slate-500 font-medium ml-2">Kleur:</span>
      <input type="color" id="colorPicker" value="${config.accentColor}" class="w-6 h-6 rounded cursor-pointer border border-slate-300">

      <button id="printBtn" class="ml-3 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5">
        <span>Download PDF</span>
      </button>
    </div>
  </header>

  <!-- SPLIT SCREEN -->
  <main class="flex-1 flex flex-col md:flex-row overflow-hidden">
    <!-- LINKER KOLOM: FORMULIER -->
    <div class="no-print w-full md:w-[480px] bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto p-4 space-y-4">
      <!-- Personalia -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700">Personalia</h2>
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">Volledige Naam</label>
          <input type="text" id="inputName" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] text-slate-600 font-medium mb-1">E-mail</label>
            <input type="email" id="inputEmail" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
          </div>
          <div>
            <label class="block text-[11px] text-slate-600 font-medium mb-1">Telefoon</label>
            <input type="text" id="inputPhone" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] text-slate-600 font-medium mb-1">Adres</label>
            <input type="text" id="inputAddress" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
          </div>
          <div>
            <label class="block text-[11px] text-slate-600 font-medium mb-1">Postcode & Plaats</label>
            <input type="text" id="inputCity" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
          </div>
        </div>
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">LinkedIn</label>
          <input type="text" id="inputLinkedin" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
        </div>
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">Profielfoto URL</label>
          <input type="text" id="inputPhoto" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
        </div>
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">Profieltekst</label>
          <textarea id="inputSummary" rows="3" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200"></textarea>
        </div>
      </div>

      <!-- Opleidingen -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <div class="flex justify-between items-center">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700">Opleidingen</h2>
          <button id="addEduBtn" class="text-xs text-blue-600 font-semibold hover:underline">+ Toevoegen</button>
        </div>
        <div id="eduList" class="space-y-3"></div>
      </div>

      <!-- Werkervaring -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <div class="flex justify-between items-center">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700">Werkervaring</h2>
          <button id="addExpBtn" class="text-xs text-blue-600 font-semibold hover:underline">+ Toevoegen</button>
        </div>
        <div id="expList" class="space-y-3"></div>
      </div>

      <!-- Vaardigheden & Hobby's -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700">Vaardigheden & Hobby's</h2>
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">Vaardigheden (komma gescheiden)</label>
          <input type="text" id="inputSkills" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
        </div>
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">Hobby's & Interesses (komma gescheiden)</label>
          <input type="text" id="inputHobbies" class="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200">
        </div>
      </div>
    </div>

    <!-- RECHTER KOLOM: LIVE A4 PREVIEW -->
    <div class="flex-1 bg-slate-200 overflow-auto p-4 md:p-8 flex justify-center items-start">
      <div id="previewContainer" class="w-[210mm] transition-all"></div>
    </div>
  </main>

  <script>
    // CV Data & Config
    let cvData = ${serializedData};
    let cvConfig = ${serializedConfig};

    // Load from localStorage if present
    const savedData = localStorage.getItem('cv_maker_data');
    if (savedData) {
      try { cvData = JSON.parse(savedData); } catch (e) {}
    }
    const savedConfig = localStorage.getItem('cv_maker_config');
    if (savedConfig) {
      try { cvConfig = JSON.parse(savedConfig); } catch (e) {}
    }

    function saveState() {
      localStorage.setItem('cv_maker_data', JSON.stringify(cvData));
      localStorage.setItem('cv_maker_config', JSON.stringify(cvConfig));
    }

    // Bind inputs
    function initForm() {
      document.getElementById('inputName').value = cvData.personal.fullName || '';
      document.getElementById('inputEmail').value = cvData.personal.email || '';
      document.getElementById('inputPhone').value = cvData.personal.phone || '';
      document.getElementById('inputAddress').value = cvData.personal.address || '';
      document.getElementById('inputCity').value = cvData.personal.postalCodeCity || '';
      document.getElementById('inputLinkedin').value = cvData.personal.linkedin || '';
      document.getElementById('inputPhoto').value = cvData.personal.photoUrl || '';
      document.getElementById('inputSummary').value = cvData.personal.summary || '';
      document.getElementById('inputSkills').value = (cvData.skills || []).join(', ');
      document.getElementById('inputHobbies').value = (cvData.hobbies || []).join(', ');
      document.getElementById('templateSelect').value = cvConfig.template || 'circulair';
      document.getElementById('colorPicker').value = cvConfig.accentColor || '#254d7e';

      // Event listeners
      ['inputName', 'inputEmail', 'inputPhone', 'inputAddress', 'inputCity', 'inputLinkedin', 'inputPhoto', 'inputSummary'].forEach(id => {
        document.getElementById(id).addEventListener('input', e => {
          const keyMap = {
            inputName: 'fullName', inputEmail: 'email', inputPhone: 'phone',
            inputAddress: 'address', inputCity: 'postalCodeCity',
            inputLinkedin: 'linkedin', inputPhoto: 'photoUrl', inputSummary: 'summary'
          };
          cvData.personal[keyMap[id]] = e.target.value;
          saveState();
          renderPreview();
        });
      });

      document.getElementById('inputSkills').addEventListener('input', e => {
        cvData.skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        saveState();
        renderPreview();
      });

      document.getElementById('inputHobbies').addEventListener('input', e => {
        cvData.hobbies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        saveState();
        renderPreview();
      });

      document.getElementById('templateSelect').addEventListener('change', e => {
        cvConfig.template = e.target.value;
        saveState();
        renderPreview();
      });

      document.getElementById('colorPicker').addEventListener('input', e => {
        cvConfig.accentColor = e.target.value;
        saveState();
        renderPreview();
      });

      document.getElementById('printBtn').addEventListener('click', () => {
        const btn = document.getElementById('printBtn');
        const origText = btn.innerHTML;
        btn.innerHTML = '<span>Bezig met downloaden...</span>';
        btn.disabled = true;

        const target = document.getElementById('previewContainer').firstElementChild;
        if (window.html2pdf && target) {
          const opt = {
            margin: 0,
            filename: (cvData.personal.fullName ? 'CV_' + cvData.personal.fullName.replace(/\\s+/g, '_') : 'CV') + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          html2pdf().from(target).set(opt).save().then(() => {
            btn.innerHTML = origText;
            btn.disabled = false;
          }).catch(() => {
            btn.innerHTML = origText;
            btn.disabled = false;
            window.print();
          });
        } else {
          btn.innerHTML = origText;
          btn.disabled = false;
          window.print();
        }
      });

      renderEduForm();
      renderExpForm();
      renderPreview();
    }

    function renderEduForm() {
      const container = document.getElementById('eduList');
      container.innerHTML = cvData.education.map((item, idx) => \`
        <div class="border border-slate-200 p-2.5 rounded-lg space-y-2 relative bg-slate-50 text-xs">
          <div class="flex justify-between items-center font-bold text-slate-700">
            <span>Opleiding #\${idx + 1}</span>
            <button onclick="removeEdu('\${item.id}')" class="text-rose-600 hover:underline">Verwijder</button>
          </div>
          <input type="text" placeholder="Opleiding / Studie" value="\${item.title || ''}" oninput="updateEdu('\${item.id}', 'title', this.value)" class="w-full px-2 py-1 border rounded">
          <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="School / Instelling" value="\${item.institution || ''}" oninput="updateEdu('\${item.id}', 'institution', this.value)" class="w-full px-2 py-1 border rounded">
            <input type="text" placeholder="Periode" value="\${item.period || ''}" oninput="updateEdu('\${item.id}', 'period', this.value)" class="w-full px-2 py-1 border rounded">
          </div>
          <textarea placeholder="Toelichting..." oninput="updateEdu('\${item.id}', 'description', this.value)" class="w-full px-2 py-1 border rounded">\${item.description || ''}</textarea>
        </div>
      \`).join('');
    }

    window.updateEdu = function(id, key, val) {
      const item = cvData.education.find(e => e.id === id);
      if (item) { item[key] = val; saveState(); renderPreview(); }
    };
    window.removeEdu = function(id) {
      cvData.education = cvData.education.filter(e => e.id !== id);
      saveState(); renderEduForm(); renderPreview();
    };
    document.getElementById('addEduBtn').addEventListener('click', () => {
      cvData.education.push({ id: 'edu-' + Date.now(), title: '', institution: '', period: '', description: '' });
      saveState(); renderEduForm(); renderPreview();
    });

    function renderExpForm() {
      const container = document.getElementById('expList');
      container.innerHTML = cvData.experience.map((item, idx) => \`
        <div class="border border-slate-200 p-2.5 rounded-lg space-y-2 relative bg-slate-50 text-xs">
          <div class="flex justify-between items-center font-bold text-slate-700">
            <span>Ervaring #\${idx + 1}</span>
            <button onclick="removeExp('\${item.id}')" class="text-rose-600 hover:underline">Verwijder</button>
          </div>
          <input type="text" placeholder="Functietitel" value="\${item.role || ''}" oninput="updateExp('\${item.id}', 'role', this.value)" class="w-full px-2 py-1 border rounded">
          <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Bedrijf" value="\${item.company || ''}" oninput="updateExp('\${item.id}', 'company', this.value)" class="w-full px-2 py-1 border rounded">
            <input type="text" placeholder="Periode" value="\${item.period || ''}" oninput="updateExp('\${item.id}', 'period', this.value)" class="w-full px-2 py-1 border rounded">
          </div>
          <textarea placeholder="Werkzaamheden..." oninput="updateExp('\${item.id}', 'description', this.value)" class="w-full px-2 py-1 border rounded">\${item.description || ''}</textarea>
        </div>
      \`).join('');
    }

    window.updateExp = function(id, key, val) {
      const item = cvData.experience.find(e => e.id === id);
      if (item) { item[key] = val; saveState(); renderPreview(); }
    };
    window.removeExp = function(id) {
      cvData.experience = cvData.experience.filter(e => e.id !== id);
      saveState(); renderExpForm(); renderPreview();
    };
    document.getElementById('addExpBtn').addEventListener('click', () => {
      cvData.experience.push({ id: 'exp-' + Date.now(), role: '', company: '', period: '', description: '' });
      saveState(); renderExpForm(); renderPreview();
    });

    function renderPreview() {
      const container = document.getElementById('previewContainer');
      const { personal, education, experience, skills, hobbies } = cvData;
      const { accentColor, template } = cvConfig;

      if (template === 'circulair') {
        container.innerHTML = \`
          <div class="a4-page bg-white text-slate-800 flex min-h-[297mm] w-full shadow-xl">
            <!-- Linker Kolom Circulair met golven -->
            <div class="w-[34%] bg-[#f2f6fa] flex flex-col justify-between relative overflow-hidden border-r border-slate-200">
              <div>
                <div class="relative pt-7 pb-10 px-4 text-center" style="background-color: \${accentColor}">
                  <h1 class="text-white font-bold text-lg tracking-wide uppercase">\${personal.fullName || ''}</h1>
                  <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 100 24" preserveAspectRatio="none" style="height:24px; transform:translateY(99%); fill:\${accentColor}">
                    <path d="M 0,0 L 100,0 C 75,22 25,22 0,0 Z"></path>
                  </svg>
                </div>

                \${personal.photoUrl ? \`
                  <div class="flex justify-center -mt-2 mb-4 relative z-10">
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200">
                      <img src="\${personal.photoUrl}" class="w-full h-full object-cover">
                    </div>
                  </div>
                \` : '<div class="h-6"></div>'}

                <div class="px-5 py-3 space-y-6">
                  <div>
                    <h2 class="text-xl font-normal mb-3 pb-1 border-b border-slate-200" style="color: \${accentColor}">Personalia</h2>
                    <ul class="space-y-2 text-[12px] text-slate-700">
                      \${personal.fullName ? \`<li><strong>\${personal.fullName}</strong></li>\` : ''}
                      \${personal.email ? \`<li>\${personal.email}</li>\` : ''}
                      \${personal.phone ? \`<li>\${personal.phone}</li>\` : ''}
                      \${(personal.address || personal.postalCodeCity) ? \`<li>\${personal.address} \${personal.postalCodeCity}</li>\` : ''}
                      \${personal.linkedin ? \`<li class="break-all text-[11px]">\${personal.linkedin}</li>\` : ''}
                    </ul>
                  </div>

                  \${hobbies && hobbies.length ? \`
                    <div>
                      <h2 class="text-xl font-normal mb-3 pb-1 border-b border-slate-200" style="color: \${accentColor}">Hobby's en interesses</h2>
                      <ul class="space-y-2 text-[12px] text-slate-700">
                        \${hobbies.map(h => \`
                          <li class="flex items-center gap-2">
                            <span class="w-2 h-2 flex-shrink-0" style="background-color: \${accentColor}"></span>
                            <span class="font-medium text-slate-800">\${h}</span>
                          </li>
                        \`).join('')}
                      </ul>
                    </div>
                  \` : ''}
                </div>
              </div>

              <!-- Onderste golf -->
              <div class="relative w-full h-12 overflow-hidden">
                <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 100 30" preserveAspectRatio="none" style="height:32px; fill:\${accentColor}">
                  <path d="M 0,30 C 35,0 65,0 100,30 L 100,30 L 0,30 Z"></path>
                </svg>
              </div>
            </div>

            <!-- Rechter Kolom -->
            <div class="w-[66%] bg-white p-8 flex flex-col justify-start">
              \${personal.summary ? \`
                <div class="mb-5">
                  <h2 class="text-xl font-normal mb-2.5 pb-1 border-b border-slate-200" style="color: \${accentColor}">Profiel</h2>
                  <p class="text-[12.5px] text-slate-700 leading-relaxed">\${personal.summary}</p>
                </div>
              \` : ''}

              \${education && education.length ? \`
                <div class="mb-5">
                  <h2 class="text-xl font-normal mb-3 pb-1 border-b border-slate-200" style="color: \${accentColor}">Opleidingen</h2>
                  <div class="space-y-3">
                    \${education.map(e => \`
                      <div class="mb-2">
                        <div class="flex justify-between items-baseline">
                          <span class="font-bold text-[13px] text-slate-900">\${e.title}</span>
                          <span class="text-[11.5px] text-slate-500 font-medium">\${e.period}</span>
                        </div>
                        <div class="text-[12px] text-slate-600 font-medium">\${e.institution}</div>
                        \${e.description ? \`<p class="text-[11.5px] text-slate-600 mt-1 whitespace-pre-line">\${e.description}</p>\` : ''}
                      </div>
                    \`).join('')}
                  </div>
                </div>
              \` : ''}

              \${experience && experience.length ? \`
                <div class="mb-5">
                  <h2 class="text-xl font-normal mb-3 pb-1 border-b border-slate-200" style="color: \${accentColor}">Werkervaring</h2>
                  <div class="space-y-3">
                    \${experience.map(exp => \`
                      <div class="mb-2">
                        <div class="flex justify-between items-baseline">
                          <span class="font-bold text-[13px] text-slate-900">\${exp.role}</span>
                          <span class="text-[11.5px] text-slate-500 font-medium">\${exp.period}</span>
                        </div>
                        <div class="text-[12px] text-slate-600 font-medium">\${exp.company}</div>
                        \${exp.description ? \`<p class="text-[11.5px] text-slate-600 mt-1 whitespace-pre-line">\${exp.description}</p>\` : ''}
                      </div>
                    \`).join('')}
                  </div>
                </div>
              \` : ''}
            </div>
          </div>
        \`;
      } else {
        // Modern / Luxe / Pro fallback layout
        container.innerHTML = \`
          <div class="a4-page bg-white text-slate-800 p-8 min-h-[297mm] w-full shadow-xl">
            <div class="border-b-2 pb-4 mb-6" style="border-color: \${accentColor}">
              <h1 class="text-3xl font-bold uppercase text-slate-900">\${personal.fullName || 'Naam'}</h1>
              <p class="text-sm font-semibold mt-1" style="color:\${accentColor}">\${personal.title || ''}</p>
              <div class="text-xs text-slate-500 mt-2 flex flex-wrap gap-3">
                <span>\${personal.email || ''}</span>
                <span>\${personal.phone || ''}</span>
                <span>\${personal.address || ''} \${personal.postalCodeCity || ''}</span>
                <span>\${personal.linkedin || ''}</span>
              </div>
            </div>
            \${personal.summary ? \`<div class="mb-5"><h2 class="text-base font-bold uppercase tracking-wider mb-2" style="color:\${accentColor}">Profiel</h2><p class="text-xs text-slate-700 leading-relaxed">\${personal.summary}</p></div>\` : ''}
            \${experience && experience.length ? \`<div class="mb-5"><h2 class="text-base font-bold uppercase tracking-wider mb-3" style="color:\${accentColor}">Werkervaring</h2>\${experience.map(e => \`<div class="mb-3"><div class="flex justify-between"><strong class="text-xs">\${e.role}</strong><span class="text-xs text-slate-500">\${e.period}</span></div><div class="text-xs text-slate-600">\${e.company}</div><p class="text-xs text-slate-600 whitespace-pre-line">\${e.description}</p></div>\`).join('')}</div>\` : ''}
            \${education && education.length ? \`<div class="mb-5"><h2 class="text-base font-bold uppercase tracking-wider mb-3" style="color:\${accentColor}">Opleidingen</h2>\${education.map(e => \`<div class="mb-3"><div class="flex justify-between"><strong class="text-xs">\${e.title}</strong><span class="text-xs text-slate-500">\${e.period}</span></div><div class="text-xs text-slate-600">\${e.institution}</div><p class="text-xs text-slate-600 whitespace-pre-line">\${e.description}</p></div>\`).join('')}</div>\` : ''}
          </div>
        \`;
      }
    }

    window.addEventListener('DOMContentLoaded', initForm);
  </script>
</body>
</html>`;
  };

  const handleCopyCode = async () => {
    const code = generateStandaloneHtml();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = () => {
    const code = generateStandaloneHtml();
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-${data.personal.fullName.toLowerCase().replace(/\s+/g, '-') || 'maker'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Single-File HTML Code
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Draait overal direct in één enkel bestand (Tailwind CDN + Vanilla JS + alle data ingebed)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info & Description */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 leading-relaxed space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              100% Onafhankelijk & Direct Gebruiksklaar:
            </p>
            <p>
              Dit bestand bevat alle HTML, CSS (via Tailwind CDN) en Vanilla JavaScript om lokaal in de browser te openen door simpelweg dubbel te klikken op het <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">.html</code>-bestand. Geen node, npm of server vereist!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Gekopieerd naar klembord!' : 'Kopieer volledige HTML code'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download als .html bestand</span>
            </button>
          </div>

          {/* Code preview snippet */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
              <span>Broncode weergave:</span>
              <span className="font-mono text-[11px]">index.html</span>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-64 select-all leading-normal border border-slate-800">
              {generateStandaloneHtml().slice(0, 1400)}
              {'\n... [volledige code wordt gekopieerd bij knopdruk]'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
