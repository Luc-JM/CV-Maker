import { CVData, CVConfig } from './types';

export const DEFAULT_CONFIG: CVConfig = {
  template: 'circulair',
  accentColor: '#254d7e', // Matches the navy blue from the attachment
  font: 'sans',
  spacing: 'normal',
};

export const DEFAULT_CV_DATA: CVData = {
  personal: {
    fullName: 'Luc Meijerink',
    title: 'Vierdejaarsstudent Finance & Control',
    email: 'lucmeijerink@gmail.com',
    phone: '+31-615474407',
    address: 'Dolderseweg 274A',
    postalCodeCity: '3734BS Den Dolder',
    linkedin: 'linkedin.com/in/luc-meijerink-16106b217',
    website: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    summary:
      'Als vierdejaarsstudent Finance & Control ben ik gedreven om mijn kennis en vaardigheden verder te ontwikkelen binnen financiële analyse en procesoptimalisatie. Mijn ervaring met forecastanalyses en urenverantwoording stelt mij in staat om met een analytische blik bij te dragen aan het verbeteren van financiële strategieën.',
  },
  education: [
    {
      id: 'edu-1',
      title: 'Minor, Futureproof met AI',
      institution: 'Hogeschool Utrecht, Utrecht',
      location: '',
      period: 'jan 2026 - heden',
      description: 'Onderzoek naar de impact van AI en het ontwikkelen van een AI-oplossing',
    },
    {
      id: 'edu-2',
      title: 'Finance & Control',
      institution: "Avans Hogeschool, 's-Hertogenbosch",
      location: '',
      period: 'jan 2023 - heden',
      description: 'Propedeuse behaald',
    },
    {
      id: 'edu-3',
      title: 'Finance, Tax & Advice',
      institution: 'Hogeschool Utrecht, Utrecht',
      location: '',
      period: 'sep 2022 - jun 2023',
      description: 'Niet vervolgd',
    },
    {
      id: 'edu-4',
      title: 'Havo',
      institution: 'De Werkplaats, Bilthoven',
      location: '',
      period: 'sep 2018 - jun 2022',
      description:
        'Profiel E&M, biologie & aardrijkskunde, diploma behaald\nProfielwerkstuk onderwerp: het opstellen van een crypto token',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Meewerkstage Finance & Control',
      company: 'Capgemini Engineering B.V., Utrecht Leidsche Rijn',
      location: '',
      period: 'sep 2025 - feb 2026',
      description:
        'Onderzoek naar de optimalisatie van het forecastproces\nCursus Introduction to PowerBI',
    },
    {
      id: 'exp-2',
      role: 'Junior PMO medewerker',
      company: 'Thales, Huizen',
      location: '',
      period: 'feb 2024 - okt 2026',
      description:
        'Taken: beheren mailbox, classificeren documenten, administratie\nOpdracht: resourceplanning visualiseren binnen Power BI',
    },
    {
      id: 'exp-3',
      role: 'Facilitair medewerker conferentiezalen',
      company: 'Hotel Ernst Sillem Hoeve, Den Dolder',
      location: '',
      period: 'jul 2022 - sep 2025',
      description: 'Conferentiezaal opbouw en inrichting, schoonmaken',
    },
    {
      id: 'exp-4',
      role: 'Vakkenvuller',
      company: 'Albert Heijn, Den Dolder',
      location: '',
      period: 'aug 2018 - sep 2020',
      description: '',
    },
  ],
  skills: [
    'Financiële analyse',
    'Power BI',
    'Forecast analyses',
    'Procesoptimalisatie',
    'Urenverantwoording',
    'Excel',
  ],
  hobbies: ['Reizen', 'Voetbal', 'Hardlopen', 'Padel'],
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
