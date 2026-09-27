import React from 'react';
import { CVData, CVConfig } from '../../types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  config: CVConfig;
}

export const ProfessioneelTemplate: React.FC<TemplateProps> = ({ data, config }) => {
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
      fontSizeHeading: 'text-sm font-bold',
      photoSize: 'w-24 h-24',
    },
    normal: {
      padding: 'p-7',
      sectionGap: 'mb-5',
      itemGap: 'mb-3.5',
      fontSizeText: 'text-[12.5px] leading-relaxed',
      fontSizeHeading: 'text-base font-bold',
      photoSize: 'w-28 h-28',
    },
    spacious: {
      padding: 'p-9',
      sectionGap: 'mb-6',
      itemGap: 'mb-4.5',
      fontSizeText: 'text-[13px] leading-relaxed',
      fontSizeHeading: 'text-lg font-bold',
      photoSize: 'w-32 h-32',
    },
  }[spacing];

  return (
    <div
      className={`a4-page bg-white text-slate-800 min-h-[297mm] w-full flex flex-col shadow-lg ${fontClass}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Banner met Accentkleur */}
      <div
        className="px-8 py-6 text-white flex items-center justify-between shadow-xs"
        style={{ backgroundColor: accentColor }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {personal.fullName || 'Naam Achternaam'}
          </h1>
          {personal.title && (
            <p className="text-white/90 text-sm font-medium mt-0.5 tracking-wide">
              {personal.title}
            </p>
          )}
        </div>

        {personal.photoUrl && (
          <div
            className={`${spacingStyles.photoSize} rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-slate-100`}
          >
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Inhoud in 2 kolommen */}
      <div className="flex-1 flex">
        {/* Linker kolom: Contact, Vaardigheden, Hobby's */}
        <div className="w-[33%] bg-slate-50 border-r border-slate-200/80 p-6 flex flex-col gap-6">
          {/* Contactgegevens */}
          <div>
            <h2
              className={`${spacingStyles.fontSizeHeading} uppercase tracking-wider mb-3 pb-1 border-b`}
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Contact
            </h2>
            <ul className="space-y-2.5 text-[11.5px] text-slate-700">
              {personal.email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span className="break-all">{personal.email}</span>
                </li>
              )}
              {personal.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{personal.phone}</span>
                </li>
              )}
              {(personal.address || personal.postalCodeCity) && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                  <div>
                    {personal.address && <div>{personal.address}</div>}
                    {personal.postalCodeCity && <div>{personal.postalCodeCity}</div>}
                  </div>
                </li>
              )}
              {personal.linkedin && (
                <li className="flex items-start gap-2">
                  <Linkedin className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span className="break-all text-[11px]">{personal.linkedin}</span>
                </li>
              )}
              {personal.website && (
                <li className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span className="break-all text-[11px]">{personal.website}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Vaardigheden */}
          {skills && skills.length > 0 && (
            <div>
              <h2
                className={`${spacingStyles.fontSizeHeading} uppercase tracking-wider mb-3 pb-1 border-b`}
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Vaardigheden
              </h2>
              <div className="space-y-2">
                {skills.map((skill, idx) => (
                  <div key={idx} className="text-[11.5px]">
                    <div className="flex justify-between font-medium text-slate-700 mb-1">
                      <span>{skill}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${85 - (idx % 3) * 10}%`,
                          backgroundColor: accentColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobby's */}
          {hobbies && hobbies.length > 0 && (
            <div>
              <h2
                className={`${spacingStyles.fontSizeHeading} uppercase tracking-wider mb-3 pb-1 border-b`}
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Interesses
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-700"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rechter kolom: Profiel, Werkervaring, Opleidingen */}
        <div className="w-[67%] p-7 flex flex-col gap-6">
          {personal.summary && (
            <div className={spacingStyles.sectionGap}>
              <h2
                className={`${spacingStyles.fontSizeHeading} uppercase tracking-wider mb-2.5 pb-1 border-b`}
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Profiel
              </h2>
              <p className={`${spacingStyles.fontSizeText} text-slate-700 leading-relaxed`}>
                {personal.summary}
              </p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className={spacingStyles.sectionGap}>
              <h2
                className={`${spacingStyles.fontSizeHeading} uppercase tracking-wider mb-3.5 pb-1 border-b`}
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Werkervaring
              </h2>

              <div className="space-y-3.5">
                {experience.map((item) => (
                  <div key={item.id} className={spacingStyles.itemGap}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-[13px] text-slate-900">{item.role}</h3>
                      {item.period && (
                        <span className="text-[11.5px] font-semibold text-slate-500 whitespace-nowrap">
                          {item.period}
                        </span>
                      )}
                    </div>
                    {item.company && (
                      <div className="text-[12px] font-medium text-slate-600 mb-0.5">
                        {item.company}
                        {item.location ? ` | ${item.location}` : ''}
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
            <div className={spacingStyles.sectionGap}>
              <h2
                className={`${spacingStyles.fontSizeHeading} uppercase tracking-wider mb-3.5 pb-1 border-b`}
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Opleidingen
              </h2>

              <div className="space-y-3.5">
                {education.map((item) => (
                  <div key={item.id} className={spacingStyles.itemGap}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-[13px] text-slate-900">{item.title}</h3>
                      {item.period && (
                        <span className="text-[11.5px] font-semibold text-slate-500 whitespace-nowrap">
                          {item.period}
                        </span>
                      )}
                    </div>
                    {item.institution && (
                      <div className="text-[12px] font-medium text-slate-600 mb-0.5">
                        {item.institution}
                        {item.location ? ` | ${item.location}` : ''}
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
