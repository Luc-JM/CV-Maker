import React from 'react';
import { CVData, CVConfig } from '../../types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  config: CVConfig;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, config }) => {
  const { personal, education, experience, skills, hobbies } = data;
  const { accentColor, font, spacing } = config;

  const fontClass =
    font === 'serif' ? 'font-serif-cv' : font === 'display' ? 'font-display-cv' : 'font-sans-cv';

  const spacingStyles = {
    compact: {
      padding: 'p-6',
      sectionGap: 'mb-4',
      itemGap: 'mb-2.5',
      fontSizeText: 'text-[11.5px] leading-snug',
      fontSizeHeading: 'text-base',
      photoSize: 'w-20 h-20',
    },
    normal: {
      padding: 'p-8',
      sectionGap: 'mb-5',
      itemGap: 'mb-3.5',
      fontSizeText: 'text-[12.5px] leading-relaxed',
      fontSizeHeading: 'text-lg',
      photoSize: 'w-24 h-24',
    },
    spacious: {
      padding: 'p-10',
      sectionGap: 'mb-6',
      itemGap: 'mb-4.5',
      fontSizeText: 'text-[13px] leading-relaxed',
      fontSizeHeading: 'text-xl',
      photoSize: 'w-28 h-28',
    },
  }[spacing];

  return (
    <div
      className={`a4-page bg-white text-slate-800 min-h-[297mm] w-full flex flex-col shadow-lg ${fontClass} ${spacingStyles.padding}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Modern Header met foto en contactstrip */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b-2 border-slate-100">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {personal.fullName || 'Naam Achternaam'}
          </h1>
          {personal.title && (
            <div
              className="text-base font-semibold mt-1 tracking-wide"
              style={{ color: accentColor }}
            >
              {personal.title}
            </div>
          )}

          {/* Contactgegevens tags */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[12px] text-slate-600">
            {personal.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.email}</span>
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.phone}</span>
              </span>
            )}
            {(personal.address || personal.postalCodeCity) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {[personal.address, personal.postalCodeCity].filter(Boolean).join(', ')}
                </span>
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.linkedin}</span>
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.website}</span>
              </span>
            )}
          </div>
        </div>

        {personal.photoUrl && (
          <div
            className={`${spacingStyles.photoSize} rounded-2xl overflow-hidden ring-4 ring-slate-100 shadow-sm flex-shrink-0`}
          >
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Tweekoloms moderne lay-out */}
      <div className="grid grid-cols-12 gap-8 pt-6 flex-1">
        {/* Linker kolom (Profiel, Vaardigheden, Hobby's) */}
        <div className="col-span-4 flex flex-col gap-6 border-r border-slate-100 pr-4">
          {personal.summary && (
            <div>
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2`}
                style={{ color: accentColor }}
              >
                <span
                  className="w-2 h-4 rounded-xs inline-block"
                  style={{ backgroundColor: accentColor }}
                />
                Profiel
              </h2>
              <p className={`${spacingStyles.fontSizeText} text-slate-600 leading-relaxed`}>
                {personal.summary}
              </p>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase tracking-wider mb-3 flex items-center gap-2`}
                style={{ color: accentColor }}
              >
                <span
                  className="w-2 h-4 rounded-xs inline-block"
                  style={{ backgroundColor: accentColor }}
                />
                Vaardigheden
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hobbies && hobbies.length > 0 && (
            <div>
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase tracking-wider mb-3 flex items-center gap-2`}
                style={{ color: accentColor }}
              >
                <span
                  className="w-2 h-4 rounded-xs inline-block"
                  style={{ backgroundColor: accentColor }}
                />
                Interesses
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md text-slate-600 bg-slate-50 border border-slate-200"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rechter kolom (Werkervaring, Opleidingen) */}
        <div className="col-span-8 flex flex-col gap-6">
          {experience && experience.length > 0 && (
            <div>
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase tracking-wider mb-4 pb-1 border-b-2`}
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Werkervaring
              </h2>

              <div className="space-y-4">
                {experience.map((item) => (
                  <div key={item.id} className="relative pl-3.5 border-l-2 border-slate-200">
                    <span
                      className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-[13.5px] text-slate-900">{item.role}</h3>
                      {item.period && (
                        <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                          {item.period}
                        </span>
                      )}
                    </div>
                    {item.company && (
                      <div className="text-[12px] font-semibold text-slate-600 mb-1">
                        {item.company}
                        {item.location ? ` • ${item.location}` : ''}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-[11.5px] text-slate-600 whitespace-pre-line leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase tracking-wider mb-4 pb-1 border-b-2`}
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Opleidingen
              </h2>

              <div className="space-y-3.5">
                {education.map((item) => (
                  <div key={item.id} className="relative pl-3.5 border-l-2 border-slate-200">
                    <span
                      className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-[13.5px] text-slate-900">{item.title}</h3>
                      {item.period && (
                        <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                          {item.period}
                        </span>
                      )}
                    </div>
                    {item.institution && (
                      <div className="text-[12px] font-semibold text-slate-600 mb-1">
                        {item.institution}
                        {item.location ? ` • ${item.location}` : ''}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-[11.5px] text-slate-600 whitespace-pre-line leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
