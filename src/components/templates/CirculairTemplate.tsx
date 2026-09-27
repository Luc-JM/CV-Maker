import React from 'react';
import { CVData, CVConfig } from '../../types';
import { User, Mail, Phone, Home, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  config: CVConfig;
}

export const CirculairTemplate: React.FC<TemplateProps> = ({ data, config }) => {
  const { personal, education, experience, skills, hobbies } = data;
  const { accentColor, font, spacing } = config;

  // Font family class
  const fontClass =
    font === 'serif' ? 'font-serif-cv' : font === 'display' ? 'font-display-cv' : 'font-sans-cv';

  // Spacing configurations
  const spacingStyles = {
    compact: {
      sidebarPadding: 'px-4 py-5',
      mainPadding: 'px-6 py-6',
      sectionGap: 'mb-4',
      itemGap: 'mb-2.5',
      fontSizeText: 'text-[11.5px] leading-snug',
      fontSizeHeading: 'text-lg',
      photoSize: 'w-24 h-24',
    },
    normal: {
      sidebarPadding: 'px-5 py-6',
      mainPadding: 'px-8 py-7',
      sectionGap: 'mb-5',
      itemGap: 'mb-3.5',
      fontSizeText: 'text-[12.5px] leading-relaxed',
      fontSizeHeading: 'text-xl',
      photoSize: 'w-28 h-28',
    },
    spacious: {
      sidebarPadding: 'px-6 py-7',
      mainPadding: 'px-9 py-8',
      sectionGap: 'mb-6',
      itemGap: 'mb-4.5',
      fontSizeText: 'text-[13px] leading-relaxed',
      fontSizeHeading: 'text-2xl',
      photoSize: 'w-32 h-32',
    },
  }[spacing];

  return (
    <div
      className={`a4-page bg-white text-slate-800 flex min-h-[297mm] w-full shadow-lg ${fontClass}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* LINKER KOLOM (Circulair zijpaneel met golven) */}
      <div className="w-[34%] bg-[#f2f6fa] flex flex-col justify-between relative overflow-hidden flex-shrink-0 border-r border-slate-200/60">
        <div>
          {/* Bovenste golf met naam & ronde foto */}
          <div
            className="relative pt-7 pb-10 px-4 text-center"
            style={{ backgroundColor: accentColor }}
          >
            <h1 className="text-white font-bold text-lg tracking-wide uppercase">
              {personal.fullName || 'Naam Achternaam'}
            </h1>

            {/* Onderste vloeiende boog/golf van de bovenste header */}
            <svg
              className="absolute left-0 w-full overflow-visible pointer-events-none"
              viewBox="0 0 100 24"
              preserveAspectRatio="none"
              style={{
                top: '100%',
                height: '24px',
              }}
            >
              <path
                d="M 0,0 L 100,0 C 75,22 25,22 0,0 Z"
                fill={accentColor}
              />
            </svg>
          </div>

          {/* Ronde profielfoto met subtiele witte rand */}
          {personal.photoUrl ? (
            <div className="flex justify-center -mt-2 mb-4 relative z-10">
              <div
                className={`${spacingStyles.photoSize} rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200 flex-shrink-0`}
              >
                <img
                  src={personal.photoUrl}
                  alt={personal.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="h-6"></div>
          )}

          {/* Personalia sectie */}
          <div className={`${spacingStyles.sidebarPadding} pt-1`}>
            <div className="mb-6">
              <h2
                className={`${spacingStyles.fontSizeHeading} font-normal mb-3 pb-1 border-b border-slate-200`}
                style={{ color: accentColor }}
              >
                Personalia
              </h2>

              <ul className="space-y-2.5 text-[12px] text-slate-700">
                {personal.fullName && (
                  <li className="flex items-center gap-2.5">
                    <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="break-all font-medium text-slate-800">{personal.fullName}</span>
                  </li>
                )}

                {personal.email && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="break-all">{personal.email}</span>
                  </li>
                )}

                {personal.phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span>{personal.phone}</span>
                  </li>
                )}

                {(personal.address || personal.postalCodeCity) && (
                  <li className="flex items-start gap-2.5">
                    <Home className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                    <div className="leading-tight">
                      {personal.address && <div>{personal.address}</div>}
                      {personal.postalCodeCity && <div>{personal.postalCodeCity}</div>}
                    </div>
                  </li>
                )}

                {personal.linkedin && (
                  <li className="flex items-center gap-2.5">
                    <Linkedin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="break-all text-[11px]">{personal.linkedin}</span>
                  </li>
                )}

                {personal.website && (
                  <li className="flex items-center gap-2.5">
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="break-all text-[11px]">{personal.website}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Vaardigheden in sidebar indien aanwezig */}
            {skills && skills.length > 0 && (
              <div className="mb-6">
                <h2
                  className={`${spacingStyles.fontSizeHeading} font-normal mb-3 pb-1 border-b border-slate-200`}
                  style={{ color: accentColor }}
                >
                  Vaardigheden
                </h2>
                <ul className="space-y-2 text-[12px] text-slate-700">
                  {skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 flex-shrink-0 rounded-xs"
                        style={{ backgroundColor: accentColor }}
                      />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hobby's en interesses */}
            {hobbies && hobbies.length > 0 && (
              <div className="mb-6">
                <h2
                  className={`${spacingStyles.fontSizeHeading} font-normal mb-3 pb-1 border-b border-slate-200`}
                  style={{ color: accentColor }}
                >
                  Hobby's en interesses
                </h2>
                <ul className="space-y-2 text-[12px] text-slate-700">
                  {hobbies.map((hobby, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 flex-shrink-0 rounded-none"
                        style={{ backgroundColor: accentColor }}
                      />
                      <span className="font-medium text-slate-800">{hobby}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Onderste cirkelvormige / boog golf accent */}
        <div className="relative w-full h-12 overflow-hidden mt-6 flex-shrink-0">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            style={{ height: '32px' }}
          >
            <path
              d="M 0,30 C 35,0 65,0 100,30 L 100,30 L 0,30 Z"
              fill={accentColor}
            />
          </svg>
        </div>
      </div>

      {/* RECHTER KOLOM (Inhoud: Profiel, Opleidingen, Werkervaring) */}
      <div className={`w-[66%] bg-white ${spacingStyles.mainPadding} flex flex-col justify-start`}>
        {/* Profiel sectie */}
        {personal.summary && (
          <div className={spacingStyles.sectionGap}>
            <h2
              className={`${spacingStyles.fontSizeHeading} font-normal mb-2.5 pb-1 border-b border-slate-200/80`}
              style={{ color: accentColor }}
            >
              Profiel
            </h2>
            <p className={`${spacingStyles.fontSizeText} text-slate-700 font-normal leading-relaxed`}>
              {personal.summary}
            </p>
          </div>
        )}

        {/* Opleidingen sectie */}
        {education && education.length > 0 && (
          <div className={spacingStyles.sectionGap}>
            <h2
              className={`${spacingStyles.fontSizeHeading} font-normal mb-3 pb-1 border-b border-slate-200/80`}
              style={{ color: accentColor }}
            >
              Opleidingen
            </h2>

            <div className="space-y-3">
              {education.map((item) => (
                <div key={item.id} className={spacingStyles.itemGap}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-[13px] text-slate-900 leading-tight">
                      {item.title}
                    </span>
                    {item.period && (
                      <span className="text-[11.5px] text-slate-500 font-medium whitespace-nowrap">
                        {item.period}
                      </span>
                    )}
                  </div>

                  {item.institution && (
                    <div className="text-[12px] font-medium text-slate-600 mt-0.5">
                      {item.institution}
                      {item.location ? `, ${item.location}` : ''}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-[11.5px] text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Werkervaring sectie */}
        {experience && experience.length > 0 && (
          <div className={spacingStyles.sectionGap}>
            <h2
              className={`${spacingStyles.fontSizeHeading} font-normal mb-3 pb-1 border-b border-slate-200/80`}
              style={{ color: accentColor }}
            >
              Werkervaring
            </h2>

            <div className="space-y-3.5">
              {experience.map((item) => (
                <div key={item.id} className={spacingStyles.itemGap}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-[13px] text-slate-900 leading-tight">
                      {item.role}
                    </span>
                    {item.period && (
                      <span className="text-[11.5px] text-slate-500 font-medium whitespace-nowrap">
                        {item.period}
                      </span>
                    )}
                  </div>

                  {item.company && (
                    <div className="text-[12px] font-medium text-slate-600 mt-0.5">
                      {item.company}
                      {item.location ? `, ${item.location}` : ''}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-[11.5px] text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
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
  );
};
