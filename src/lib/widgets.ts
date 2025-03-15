import type { WidgetJoinMetricsPreview } from './server/db/schema';
import { FLAT_COLOR_ICONS } from './icons';

// Collection of mock widgets for demonstration purposes
export const mockWidgets: WidgetJoinMetricsPreview[] = [
  // Widget 1 - Software Engineering skills (LEFT)
  {
    title: 'Full-Stack Development',
    subtitle: 'Programming expertise across multiple technologies',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Years',
        value: 5.5,
        timeRange: 'all time',
        valueDecimalPrecision: 1,
        order: 2,
      },
    ],
  },

  // Widget 2 - Career progress (LEFT)
  {
    title: 'Career Progression',
    subtitle: 'Professional growth and leadership',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Companies',
        value: 3,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
      {
        name: 'Leadership',
        value: 2,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 3,
      },
    ],
  },

  // Widget 3 - Technical writing (LEFT)
  {
    title: 'Content Creation',
    subtitle: 'Technical writing and publications',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Books',
        value: 1,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },

  // Widget 5 - Open Source contributions (LEFT)
  {
    title: 'Open Source',
    subtitle: 'Community collaboration',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Contributions',
        value: 347,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
      {
        name: 'Stars',
        value: 2580,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 3,
      },
    ],
  },

  // Widget 6 - Design Skills (LEFT)
  {
    title: 'UI/UX Design',
    subtitle: 'User experience expertise',
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
        timeRange: 'all time',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Certifications',
        value: 8,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },

  // Widget 9 - Project leadership (RIGHT)
  {
    title: 'Project Leadership',
    subtitle: 'Managing technical initiatives',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Team Size',
        value: 18,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
      {
        name: 'Revenue ($M)',
        value: 4.7,
        timeRange: 'all time',
        valueDecimalPrecision: 1,
        order: 3,
      },
    ],
  },

  // Widget 10 - Patent Portfolio (RIGHT)
  {
    title: 'IP Portfolio',
    subtitle: 'Patents and trademarks',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Trademarks',
        value: 2,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },

  // Widget 11 - Professional speaking (RIGHT)
  {
    title: 'Public Speaking',
    subtitle: 'Conference talks and workshops',
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
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 1,
      },
      {
        name: 'Workshops',
        value: 32,
        timeRange: 'all time',
        valueDecimalPrecision: 0,
        order: 2,
      },
    ],
  },
];
