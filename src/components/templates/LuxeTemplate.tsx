import React from 'react';
import { CVData, CVConfig } from '../../types';

interface TemplateProps {
  data: CVData;
  config: CVConfig;
}

export const LuxeTemplate: React.FC<TemplateProps> = ({ data, config }) => {
  const { personal, education, experience, skills, hobbies } = data;
  const { accentColor, spacing } = config;

  const spacingStyles = {
    compact: {
      padding: 'p-8',
      sectionGap: 'mb-5',
      itemGap: 'mb-3',
      fontSizeText: 'text-[12px] leading-relaxed',
      fontSizeHeading: 'text-sm tracking-[0.2em]',
      photoSize: 'w-20 h-20',
    },
    normal: {
      padding: 'p-10',
      sectionGap: 'mb-6',
      itemGap: 'mb-4',
      fontSizeText: 'text-[12.5px] leading-relaxed',
      fontSizeHeading: 'text-base tracking-[0.22em]',
      photoSize: 'w-24 h-24',
    },
    spacious: {
      padding: 'p-12',
      sectionGap: 'mb-7',
      itemGap: 'mb-5',
      fontSizeText: 'text-[13px] leading-relaxed',
      fontSizeHeading: 'text-lg tracking-[0.25em]',
      photoSize: 'w-28 h-28',
    },
  }[spacing];

  const contactList = [
    personal.email,
    personal.phone,
    [personal.address, personal.postalCodeCity].filter(Boolean).join(', '),
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div
      className={`a4-page bg-[#fafaf9] text-stone-800 min-h-[297mm] w-full flex flex-col shadow-lg font-serif-cv ${spacingStyles.padding}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Elegante Centered Header */}
      <div className="text-center pb-6 border-b border-stone-300">
        {personal.photoUrl && (
          <div className="flex justify-center mb-4">
            <div
              className={`${spacingStyles.photoSize} rounded-full overflow-hidden border-2 p-1 bg-white shadow-sm`}
              style={{ borderColor: accentColor }}
            >
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        )}

        <h1
          className="text-3xl font-normal tracking-[0.15em] uppercase text-stone-900"
          style={{ letterSpacing: '0.12em' }}
        >
          {personal.fullName || 'Naam Achternaam'}
        </h1>

        {personal.title && (
          <p
            className="text-xs italic tracking-widest mt-1.5 uppercase"
            style={{ color: accentColor }}
          >
            {personal.title}
          </p>
        )}

        {contactList.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-3.5 text-[11px] text-stone-500 font-sans-cv">
            {contactList.map((item, idx) => (
              <React.Fragment key={idx}>
                <span>{item}</span>
                {idx < contactList.length - 1 && (
                  <span className="text-stone-300 select-none">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 space-y-6 flex-1">
        {/* Profiel */}
        {personal.summary && (
          <div className={spacingStyles.sectionGap}>
            <div className="flex items-center gap-3 mb-2.5">
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase`}
                style={{ color: accentColor }}
              >
                Persoonlijk Profiel
              </h2>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <p className={`${spacingStyles.fontSizeText} text-stone-700 italic leading-relaxed`}>
              "{personal.summary}"
            </p>
          </div>
        )}

        {/* Werkervaring */}
        {experience && experience.length > 0 && (
          <div className={spacingStyles.sectionGap}>
            <div className="flex items-center gap-3 mb-3.5">
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase`}
                style={{ color: accentColor }}
              >
                Werkervaring
              </h2>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <div className="space-y-4">
              {experience.map((item) => (
                <div key={item.id} className={spacingStyles.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13.5px] text-stone-900 tracking-wide">
                      {item.role}
                    </h3>
                    {item.period && (
                      <span className="text-[11px] italic text-stone-500 font-sans-cv">
                        {item.period}
                      </span>
                    )}
                  </div>
                  {item.company && (
                    <div className="text-[12px] text-stone-600 font-sans-cv mb-1">
                      {item.company}
                      {item.location ? `, ${item.location}` : ''}
                    </div>
                  )}
                  {item.description && (
                    <p className={`${spacingStyles.fontSizeText} text-stone-600 whitespace-pre-line`}>
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opleidingen */}
        {education && education.length > 0 && (
          <div className={spacingStyles.sectionGap}>
            <div className="flex items-center gap-3 mb-3.5">
              <h2
                className={`${spacingStyles.fontSizeHeading} font-bold uppercase`}
                style={{ color: accentColor }}
              >
                Opleidingen & Cursussen
              </h2>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <div className="space-y-3.5">
              {education.map((item) => (
                <div key={item.id} className={spacingStyles.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13.5px] text-stone-900 tracking-wide">
                      {item.title}
                    </h3>
                    {item.period && (
                      <span className="text-[11px] italic text-stone-500 font-sans-cv">
                        {item.period}
                      </span>
                    )}
                  </div>
                  {item.institution && (
                    <div className="text-[12px] text-stone-600 font-sans-cv mb-1">
                      {item.institution}
                      {item.location ? `, ${item.location}` : ''}
                    </div>
                  )}
                  {item.description && (
                    <p className={`${spacingStyles.fontSizeText} text-stone-600 whitespace-pre-line`}>
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vaardigheden & Interesses gecombineerd onderaan in Luxe stijl */}
        {((skills && skills.length > 0) || (hobbies && hobbies.length > 0)) && (
          <div className="grid grid-cols-2 gap-8 pt-2">
            {skills && skills.length > 0 && (
              <div>
                <h3
                  className="text-xs uppercase tracking-[0.2em] font-bold mb-2 pb-1 border-b border-stone-200"
                  style={{ color: accentColor }}
                >
                  Expertise & Vaardigheden
                </h3>
                <div className="flex flex-wrap gap-1.5 font-sans-cv">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-200/70 text-stone-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hobbies && hobbies.length > 0 && (
              <div>
                <h3
                  className="text-xs uppercase tracking-[0.2em] font-bold mb-2 pb-1 border-b border-stone-200"
                  style={{ color: accentColor }}
                >
                  Interesses & Activiteiten
                </h3>
                <div className="flex flex-wrap gap-1.5 font-sans-cv">
                  {hobbies.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-200/70 text-stone-700"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
