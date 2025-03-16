import type { WidgetJoinMetricsPreview } from './server/db/schema';
import { FLAT_COLOR_ICONS } from './icons';

// Collection of mock widgets for demonstration purposes
export const mockWidgets: WidgetJoinMetricsPreview[] = [
  // Widget 1 - Software Engineering skills (LEFT)
  {
    title: 'Full-Stack Development',
    subtitle: 'Programming expertise across multiple technologies',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.code,
    imagePlacement: 'left',
    padding: 16,
    border: true,
    borderWidth: 1,
    borderRadius: 8,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Projects',
        value: 27,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Years',
        value: 5.5,
        calculationType: 'all time',
        valueDecimalPrecision: 1,
        order: 2,
      },
    ],
  },

  // Widget 2 - Career progress (LEFT)
  {
    title: 'Career Progression',
    subtitle: 'Professional growth and leadership',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.businessman,
    imagePlacement: 'left',
    padding: 18,
    border: true,
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Promotions',
        value: 4,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Companies',
        value: 3,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
      {
        name: 'Leadership',
        value: 2,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 3,
      },
    ],
  },

  // Widget 3 - Technical writing (LEFT)
  {
    title: 'Content Creation',
    subtitle: 'Technical writing and publications',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.library,
    imagePlacement: 'left',
    padding: 16,
    border: true,
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Articles',
        value: 42,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Books',
        value: 1,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },

  // Widget 5 - Open Source contributions (LEFT)
  {
    title: 'Open Source',
    subtitle: 'Community collaboration',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.link,
    imagePlacement: 'left',
    padding: 16,
    border: true,
    borderWidth: 1,
    borderRadius: 8,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Projects',
        value: 12,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Contributions',
        value: 347,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
      {
        name: 'Stars',
        value: 2580,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 3,
      },
    ],
  },

  // Widget 6 - Design Skills (LEFT)
  {
    title: 'UI/UX Design',
    subtitle: 'User experience expertise',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.view_details,
    imagePlacement: 'left',
    padding: 20,
    border: true,
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Design Systems',
        value: 6,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
    ],
  },

  // SECOND HALF - ALL RIGHT IMAGE PLACEMENT

  // Widget 7 - Educational achievements (RIGHT)
  {
    title: 'Education',
    subtitle: 'Academic credentials and learning',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.graduation_cap,
    imagePlacement: 'right',
    padding: 20,
    border: true,
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Degrees',
        value: 2,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Certifications',
        value: 8,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },

  // Widget 9 - Project leadership (RIGHT)
  {
    title: 'Project Leadership',
    subtitle: 'Managing technical initiatives',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.mind_map,
    imagePlacement: 'right',
    padding: 22,
    border: true,
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Projects',
        value: 12,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Team Size',
        value: 18,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
      {
        name: 'Revenue ($M)',
        value: 4.7,
        calculationType: 'all time',
        valueDecimalPrecision: 1,
        order: 3,
      },
    ],
  },

  // Widget 10 - Patent Portfolio (RIGHT)
  {
    title: 'IP Portfolio',
    subtitle: 'Patents and trademarks',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.copyright,
    imagePlacement: 'right',
    padding: 16,
    border: true,
    borderWidth: 1,
    borderRadius: 5,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Patents',
        value: 3,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Trademarks',
        value: 2,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },

  // Widget 11 - Professional speaking (RIGHT)
  {
    title: 'Public Speaking',
    subtitle: 'Conference talks and workshops',
    textIcon: null,
    imageUrl: FLAT_COLOR_ICONS.assistant,
    imagePlacement: 'right',
    padding: 24,
    border: true,
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
    accentColor: '#32AD86',
    backgroundColor: '#FFFFFF',
    watermark: false,
    metrics: [
      {
        name: 'Conferences',
        value: 18,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Workshops',
        value: 32,
        calculationType: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },
];
