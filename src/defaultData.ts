import { CVData, CVConfig } from './types';

export const DEFAULT_CONFIG: CVConfig = {
  template: 'circulair',
  accentColor: '#254d7e',
  font: 'sans',
  spacing: 'normal',
};

// Generiek, neutraal voorbeeldprofiel voor nieuwe bezoekers (bijv. na deployment op Vercel)
// Persoonlijke gegevens van de gebruiker worden uitsluitend in diens eigen browser localStorage bewaard.
export const DEFAULT_CV_DATA: CVData = {
  personal: {
    fullName: 'Jan de Vries',
    title: 'Marketing & Communicatie Specialist',
    email: 'jan.devries@voorbeeld.nl',
    phone: '+31 6 12345678',
    address: 'Keizersgracht 421',
    postalCodeCity: '1016 EK Amsterdam',
    linkedin: 'linkedin.com/in/jan-devries-voorbeeld',
    website: 'www.jandevries-portfolio.nl',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    summary:
      'Gedreven en resultaatgerichte professional met ruim 4 jaar ervaring in strategische marketing, contentcreatie en procesoptimalisatie. Sterk in het vertalen van complexe doelstellingen naar data-gedreven campagnes en duidelijke communicatie.',
  },
  education: [
    {
      id: 'edu-1',
      title: 'Master Bedrijfskunde & Marketing',
      institution: 'Universiteit van Amsterdam',
      location: 'Amsterdam',
      period: 'sep 2021 - jun 2023',
      description: 'Afstudeerrichting: Strategisch Merkenbeleid & Digitale Transformatie. Masterscriptie beoordeeld met een 8,5.',
    },
    {
      id: 'edu-2',
      title: 'Bachelor Commerciële Economie',
      institution: 'Hogeschool van Amsterdam',
      location: 'Amsterdam',
      period: 'sep 2017 - jun 2021',
      description: 'Specialisatie in Digital Marketing, E-commerce en Consumer Behavior. Propedeuse cum laude behaald.',
    },
    {
      id: 'edu-3',
      title: 'Vwo (Economie & Maatschappij)',
      institution: 'Stedelijk Gymnasium',
      location: 'Utrecht',
      period: 'sep 2011 - jun 2017',
      description: 'Diploma behaald met profielwerkstuk over duurzame ondernemingsmodellen.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Marketing & Campagne Coördinator',
      company: 'Brandflow Media B.V.',
      location: 'Amsterdam',
      period: 'jul 2023 - heden',
      description:
        'Leidinggeven aan omnichannel marketingcampagnes en coördinatie van het contentteam.\nOptimalisatie van conversieratio’s met +28% en implementatie van geautomatiseerde lead nurturing.',
    },
    {
      id: 'exp-2',
      role: 'Marketing & Communicatie Medewerker',
      company: 'Nexus Creative Agency',
      location: 'Utrecht',
      period: 'aug 2021 - jun 2023',
      description:
        'Beheer van social media kanalen, opstellen van persberichten en coördinatie van relatie-evenementen.\nPeriodieke dashboardanalyses via Power BI en Google Analytics.',
    },
    {
      id: 'exp-3',
      role: 'Meewerkstage Digital Marketing',
      company: 'Vanguard Retail Group',
      location: 'Rotterdam',
      period: 'sep 2020 - jan 2021',
      description:
        'Uitvoeren van SEO- en SEA-analyses, A/B testing op landingspagina’s en opstellen van maandelijkse rapportages.',
    },
  ],
  skills: [
    'Strategische marketing',
    'Contentcreatie & Copywriting',
    'Google Analytics & Power BI',
    'SEO & SEA Optimalisatie',
    'Projectmanagement',
    'Adobe Creative Suite',
  ],
  hobbies: ['Fotografie', 'Hardlopen & Marathon', 'Reizen & Cultuur', 'Padel'],
};

export const BLANK_CV_DATA: CVData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    postalCodeCity: '',
    linkedin: '',
    website: '',
    photoUrl: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  hobbies: [],
};
