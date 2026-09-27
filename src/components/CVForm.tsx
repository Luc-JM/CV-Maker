import React, { useState } from 'react';
import { CVData, EducationItem, ExperienceItem } from '../types';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  FileText,
  MapPin,
  Mail,
  Phone,
  Linkedin,
} from 'lucide-react';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export const CVForm: React.FC<CVFormProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>(
    'personal'
  );

  const [skillInput, setSkillInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');

  // Handle personal info changes
  const updatePersonal = (field: keyof typeof data.personal, value: string) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value,
      },
    });
  };

  // Profile photo upload handling
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        updatePersonal('photoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Experience actions
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: '',
      company: '',
      location: '',
      period: 'heden',
      description: '',
    };
    onChange({
      ...data,
      experience: [newItem, ...data.experience],
    });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((item) => item.id !== id),
    });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.experience.length) return;
    const newItems = [...data.experience];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange({ ...data, experience: newItems });
  };

  // Education actions
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      title: '',
      institution: '',
      location: '',
      period: 'heden',
      description: '',
    };
    onChange({
      ...data,
      education: [newItem, ...data.education],
    });
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    onChange({
      ...data,
      education: data.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((item) => item.id !== id),
    });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.education.length) return;
    const newItems = [...data.education];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange({ ...data, education: newItems });
  };

  // Skills
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({
        ...data,
        skills: [...data.skills, trimmed],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, idx) => idx !== index),
    });
  };

  // Hobbies
  const addHobby = (hobby: string) => {
    const trimmed = hobby.trim();
    if (trimmed && !data.hobbies.includes(trimmed)) {
      onChange({
        ...data,
        hobbies: [...data.hobbies, trimmed],
      });
      setHobbyInput('');
    }
  };

  const removeHobby = (index: number) => {
    onChange({
      ...data,
      hobbies: data.hobbies.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 overflow-hidden">
      {/* Categorie Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-2 pt-2 gap-1 overflow-x-auto select-none flex-shrink-0">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'personal'
              ? 'bg-slate-50 text-blue-700 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Personalia & Profiel</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'experience'
              ? 'bg-slate-50 text-blue-700 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Werkervaring</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
            {data.experience.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'education'
              ? 'bg-slate-50 text-blue-700 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Opleidingen</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
            {data.education.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'skills'
              ? 'bg-slate-50 text-blue-700 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vaardigheden & Hobby's</span>
        </button>
      </div>

      {/* Tab Inhoud met soepele scrolling */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* TAB 1: PERSONALIA & PROFIEL */}
        {activeTab === 'personal' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Foto Upload & Preview */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Profielfoto
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {data.personal.photoUrl ? (
                    <img
                      src={data.personal.photoUrl}
                      alt="Profielfoto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition border border-blue-200">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Bestand uploaden</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {data.personal.photoUrl && (
                      <button
                        onClick={() => updatePersonal('photoUrl', '')}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 cursor-pointer"
                      >
                        Verwijderen
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Of plak afbeeldings-URL (https://...)"
                    value={data.personal.photoUrl}
                    onChange={(e) => updatePersonal('photoUrl', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Basis Personalia */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Basisgegevens</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Volledige Naam
                  </label>
                  <input
                    type="text"
                    value={data.personal.fullName}
                    onChange={(e) => updatePersonal('fullName', e.target.value)}
                    placeholder="bijv. Luc Meijerink"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Functietitel / Opleiding
                  </label>
                  <input
                    type="text"
                    value={data.personal.title}
                    onChange={(e) => updatePersonal('title', e.target.value)}
                    placeholder="bijv. Student Finance & Control"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>E-mailadres</span>
                  </label>
                  <input
                    type="email"
                    value={data.personal.email}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                    placeholder="bijv. lucmeijerink@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Telefoonnummer</span>
                  </label>
                  <input
                    type="tel"
                    value={data.personal.phone}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    placeholder="bijv. +31-615474407"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Straat en huisnummer</span>
                  </label>
                  <input
                    type="text"
                    value={data.personal.address}
                    onChange={(e) => updatePersonal('address', e.target.value)}
                    placeholder="bijv. Dolderseweg 274A"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Postcode en Woonplaats
                  </label>
                  <input
                    type="text"
                    value={data.personal.postalCodeCity}
                    onChange={(e) => updatePersonal('postalCodeCity', e.target.value)}
                    placeholder="bijv. 3734BS Den Dolder"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-slate-400" />
                    <span>LinkedIn profiel URL</span>
                  </label>
                  <input
                    type="text"
                    value={data.personal.linkedin}
                    onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    placeholder="bijv. linkedin.com/in/luc-meijerink-..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Website / Portfolio
                  </label>
                  <input
                    type="text"
                    value={data.personal.website}
                    onChange={(e) => updatePersonal('website', e.target.value)}
                    placeholder="bijv. www.mijnportfolio.nl"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Profiel & Introductietekst */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Profiel & Introductie</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Beschrijf kort je achtergrond, passie, doel en sterke punten in 2 tot 4 zinnen.
              </p>
              <textarea
                rows={4}
                value={data.personal.summary}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                placeholder="Bijv. Als vierdejaarsstudent ben ik gedreven om..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: WERKERVARING */}
        {activeTab === 'experience' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Werkervaringen ({data.experience.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Voeg relevante banen, stages en bijbanen toe.
                </p>
              </div>
              <button
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Toevoegen</span>
              </button>
            </div>

            {data.experience.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Nog geen werkervaring toegevoegd.</p>
                <button
                  onClick={addExperience}
                  className="mt-3 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  + Eerste werkervaring toevoegen
                </button>
              </div>
            ) : (
              data.experience.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">
                      #{index + 1} {item.role || 'Nieuwe rol'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveExperience(index, 'up')}
                        disabled={index === 0}
                        title="Omhoog verplaatsen"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveExperience(index, 'down')}
                        disabled={index === data.experience.length - 1}
                        title="Omlaag verplaatsen"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeExperience(item.id)}
                        title="Verwijderen"
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Functie / Rol
                      </label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => updateExperience(item.id, 'role', e.target.value)}
                        placeholder="bijv. Meewerkstage Finance & Control"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Periode / Datums
                      </label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => updateExperience(item.id, 'period', e.target.value)}
                        placeholder="bijv. sep 2025 - feb 2026"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Werkgever / Bedrijf
                      </label>
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => updateExperience(item.id, 'company', e.target.value)}
                        placeholder="bijv. Capgemini Engineering B.V."
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Locatie (optioneel)
                      </label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => updateExperience(item.id, 'location', e.target.value)}
                        placeholder="bijv. Utrecht Leidsche Rijn"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Werkzaamheden & Prestaties
                    </label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateExperience(item.id, 'description', e.target.value)}
                      placeholder="Beschrijf projecten, behaalde resultaten of taken..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: OPLEIDINGEN */}
        {activeTab === 'education' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Opleidingen & Studies ({data.education.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Voeg behaalde of huidige opleidingen en minors toe.
                </p>
              </div>
              <button
                onClick={addEducation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Toevoegen</span>
              </button>
            </div>

            {data.education.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Nog geen opleiding toegevoegd.</p>
                <button
                  onClick={addEducation}
                  className="mt-3 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  + Eerste studie toevoegen
                </button>
              </div>
            ) : (
              data.education.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">
                      #{index + 1} {item.title || 'Nieuwe studie'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveEducation(index, 'up')}
                        disabled={index === 0}
                        title="Omhoog verplaatsen"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveEducation(index, 'down')}
                        disabled={index === data.education.length - 1}
                        title="Omlaag verplaatsen"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeEducation(item.id)}
                        title="Verwijderen"
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Opleiding / Studie / Minor
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateEducation(item.id, 'title', e.target.value)}
                        placeholder="bijv. Finance & Control"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Periode / Jaartallen
                      </label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => updateEducation(item.id, 'period', e.target.value)}
                        placeholder="bijv. jan 2023 - heden"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Onderwijsinstelling / School
                      </label>
                      <input
                        type="text"
                        value={item.institution}
                        onChange={(e) => updateEducation(item.id, 'institution', e.target.value)}
                        placeholder="bijv. Avans Hogeschool"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Locatie (optioneel)
                      </label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => updateEducation(item.id, 'location', e.target.value)}
                        placeholder="bijv. 's-Hertogenbosch"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Toelichting / Resultaat (optioneel)
                    </label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateEducation(item.id, 'description', e.target.value)}
                      placeholder="bijv. Propedeuse behaald, minor AI afgerond..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: VAARDIGHEDEN & HOBBY'S */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Vaardigheden */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vaardigheden & Competenties</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Druk op <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-[10px]">Enter</kbd> om een vaardigheid toe te voegen.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Voeg bijv. 'Power BI' of 'Financiële analyse' toe..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Toevoegen
                </button>
              </div>

              {/* Taglijst */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-blue-500 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Snelle suggesties */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Snelle suggesties:
                </span>
                <div className="flex flex-wrap gap-1">
                  {['Excel', 'Power BI', 'Financiële analyse', 'Python', 'Scrum', 'Rapportage'].map(
                    (s) =>
                      !data.skills.includes(s) && (
                        <button
                          key={s}
                          type="button"
                          onClick={() => addSkill(s)}
                          className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer transition"
                        >
                          + {s}
                        </button>
                      )
                  )}
                </div>
              </div>
            </div>

            {/* Hobby's en Interesses */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Hobby's & Interesses
                </h3>
                <p className="text-[11px] text-slate-500">
                  Laat zien wie je bent buiten je studie of werk.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHobby(hobbyInput);
                    }
                  }}
                  placeholder="Voeg bijv. 'Padel' of 'Reizen' toe..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addHobby(hobbyInput)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Toevoegen
                </button>
              </div>

              {/* Taglijst */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                  >
                    <span>{hobby}</span>
                    <button
                      type="button"
                      onClick={() => removeHobby(index)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Snelle suggesties */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Snelle suggesties:
                </span>
                <div className="flex flex-wrap gap-1">
                  {['Reizen', 'Voetbal', 'Hardlopen', 'Padel', 'Fitness', 'Koken'].map(
                    (h) =>
                      !data.hobbies.includes(h) && (
                        <button
                          key={h}
                          type="button"
                          onClick={() => addHobby(h)}
                          className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer transition"
                        >
                          + {h}
                        </button>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
