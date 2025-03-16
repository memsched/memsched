#!/usr/bin/env node
/**
 * Widget SVG Generator Script
 *
 * This script generates .svelte files containing SVG widgets from widget configurations.
 * Usage:
 *   node scripts/generate-widgets.js [output-dir]
 *
 * Options:
 *   output-dir: Directory where SVG files will be generated (default: ./generated-widgets)
 */

import fs from 'fs';
import path from 'path';

// Use native fetch in Node.js (available in Node.js 18+)
// For Node.js <18, you would need to install node-fetch:
// npm install node-fetch

// Parse command line arguments
const args = process.argv.slice(2);
let outputDir = './generated-widgets';

// First argument is output directory if provided
if (args.length > 0 && !args[0].startsWith('--')) {
  outputDir = args[0];
}

// Make output dir absolute if it's relative
if (!path.isAbsolute(outputDir)) {
  outputDir = path.resolve(process.cwd(), outputDir);
}

// Configuration
const API_URL = 'http://localhost:5173/dev/widget-preview';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory: ${outputDir}`);
}

// Widget configurations - add or modify as needed
const widgetConfigs = [
  {
    name: 'LanguageLearning',
    config: {
      title: 'Language Progress',
      subtitle: 'My journey to fluency',
      textIcon: null,
      imageUrl: '/icons/circle-flag-icons/jp.svg',
      imagePlacement: 'left',
      padding: 16,
      border: true,
      borderWidth: 1,
      borderRadius: 8,
      color: '#000000',
      accentColor: '#ff6b6b',
      backgroundColor: '#f8f9fa',
      watermark: true,
      metrics: [
        {
          name: 'Vocabulary',
          value: 750,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Study Hours',
          value: 120,
          calculationType: 'month',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Fluency',
          value: 42,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'CodingSkills',
    config: {
      title: 'Developer Skills',
      subtitle: 'TypeScript & React mastery',
      textIcon: null,
      imageUrl: '/icons/vscode-icons/file_type_typescript.svg',
      imagePlacement: 'left',
      padding: 20,
      border: true,
      borderWidth: 2,
      borderRadius: 12,
      color: '#ffffff',
      accentColor: '#0ea5e9',
      backgroundColor: '#0f172a',
      watermark: true,
      metrics: [
        {
          name: 'Projects',
          value: 8,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'GitHub Stars',
          value: 124,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 2,
        },
      ],
    },
  },
  {
    name: 'BookTracker',
    config: {
      title: 'Reading Challenge',
      subtitle: 'My reading journey',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/reading.svg',
      imagePlacement: 'right',
      padding: 16,
      border: true,
      borderWidth: 1,
      borderRadius: 8,
      color: '#1e293b',
      accentColor: '#8b5cf6',
      backgroundColor: '#f8fafc',
      watermark: true,
      metrics: [
        {
          name: 'Books Read',
          value: 12,
          calculationType: 'year',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Pages',
          value: 3546,
          calculationType: 'year',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Reading Time',
          value: 120,
          calculationType: 'month',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'DataScienceJourney',
    config: {
      title: 'Data Science Progress',
      subtitle: 'Machine Learning & AI',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/idea.svg',
      imagePlacement: 'left',
      padding: 24,
      border: true,
      borderWidth: 0,
      borderRadius: 16,
      color: '#ffffff',
      accentColor: '#10b981',
      backgroundColor: '#1e1e2f',
      watermark: true,
      metrics: [
        {
          name: 'Kaggle Rank',
          value: 1250,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Models Built',
          value: 8,
          calculationType: 'year',
          valueDecimalPrecision: 0,
          order: 2,
        },
      ],
    },
  },
  {
    name: 'FitnessJourney',
    config: {
      title: 'Fitness Tracker',
      subtitle: 'Health & Wellness Goals',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/sports_mode.svg',
      imagePlacement: 'right',
      padding: 20,
      border: true,
      borderWidth: 2,
      borderRadius: 24,
      color: '#000000',
      accentColor: '#ef4444',
      backgroundColor: '#ffffff',
      watermark: true,
      metrics: [
        {
          name: 'Workouts',
          value: 24,
          calculationType: 'month',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Running (km)',
          value: 87.5,
          calculationType: 'month',
          valueDecimalPrecision: 1,
          order: 2,
        },
      ],
    },
  },
  {
    name: 'MusicLearning',
    config: {
      title: 'Piano Progress',
      subtitle: 'My musical journey',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/sound_recording_copyright.svg',
      imagePlacement: 'left',
      padding: 16,
      border: true,
      borderWidth: 1,
      borderRadius: 10,
      color: '#ffffff',
      accentColor: '#f59e0b',
      backgroundColor: '#4b5563',
      watermark: true,
      metrics: [
        {
          name: 'Songs Learned',
          value: 15,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Practice Hours',
          value: 164,
          calculationType: 'year',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Skill Level',
          value: 6.8,
          calculationType: 'total',
          valueDecimalPrecision: 1,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'DesignPortfolio',
    config: {
      title: 'Design Portfolio',
      subtitle: 'UI/UX projects & skills',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/edit_image.svg',
      imagePlacement: 'left',
      padding: 20,
      border: false,
      borderWidth: 0,
      borderRadius: 16,
      color: '#111111',
      accentColor: '#ec4899',
      backgroundColor: '#f9fafb',
      watermark: true,
      metrics: [
        {
          name: 'Projects',
          value: 24,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Client Rating',
          value: 4.9,
          calculationType: 'total',
          valueDecimalPrecision: 1,
          order: 2,
        },
      ],
    },
  },
  {
    name: 'ProductivityTracker',
    config: {
      title: 'Productivity Stats',
      subtitle: 'Focus & Deep Work',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/overtime.svg',
      imagePlacement: 'right',
      padding: 16,
      border: true,
      borderWidth: 1,
      borderRadius: 6,
      color: '#374151',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      watermark: true,
      metrics: [
        {
          name: 'Deep Work',
          value: 28.5,
          calculationType: 'week',
          valueDecimalPrecision: 1,
          order: 1,
        },
        {
          name: 'Tasks Completed',
          value: 42,
          calculationType: 'week',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Focus Score',
          value: 8.2,
          calculationType: 'week',
          valueDecimalPrecision: 1,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'OpenSourceContributions',
    config: {
      title: 'Open Source Impact',
      subtitle: 'Community contributions',
      textIcon: null,
      imageUrl: '/icons/vscode-icons/file_type_github.svg',
      imagePlacement: 'left',
      padding: 20,
      border: true,
      borderWidth: 1,
      borderRadius: 12,
      color: '#ffffff',
      accentColor: '#6366f1',
      backgroundColor: '#27272a',
      watermark: true,
      metrics: [
        {
          name: 'PRs Merged',
          value: 47,
          calculationType: 'year',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Repositories',
          value: 12,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Contributors',
          value: 84,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'ResearchPublications',
    config: {
      title: 'Academic Research',
      subtitle: 'Publications & Citations',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/graduation_cap.svg',
      imagePlacement: 'left',
      padding: 18,
      border: true,
      borderWidth: 1,
      borderRadius: 10,
      color: '#1e293b',
      accentColor: '#0369a1',
      backgroundColor: '#f1f5f9',
      watermark: true,
      metrics: [
        {
          name: 'Publications',
          value: 8,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Citations',
          value: 156,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'h-index',
          value: 5,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'ProfessionalCertifications',
    config: {
      title: 'Certifications',
      subtitle: 'Professional credentials',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/diploma_1.svg',
      imagePlacement: 'right',
      padding: 22,
      border: true,
      borderWidth: 2,
      borderRadius: 14,
      color: '#ffffff',
      accentColor: '#14b8a6',
      backgroundColor: '#0f172a',
      watermark: true,
      metrics: [
        {
          name: 'Certifications',
          value: 9,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Skills Verified',
          value: 24,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Industry Rank',
          value: 'Top 5%',
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'PublicSpeaking',
    config: {
      title: 'Speaking Engagements',
      subtitle: 'Conferences & Workshops',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/voice_presentation.svg',
      imagePlacement: 'left',
      padding: 18,
      border: false,
      borderWidth: 0,
      borderRadius: 16,
      color: '#ffffff',
      accentColor: '#f97316',
      backgroundColor: '#3b0764',
      watermark: true,
      metrics: [
        {
          name: 'Presentations',
          value: 18,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Countries',
          value: 7,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Audience Reach',
          value: 4500,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'StartupJourney',
    config: {
      title: 'Startup Progress',
      subtitle: 'From idea to market',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/business.svg',
      imagePlacement: 'right',
      padding: 20,
      border: true,
      borderWidth: 1,
      borderRadius: 16,
      color: '#000000',
      accentColor: '#0284c7',
      backgroundColor: '#f0f9ff',
      watermark: true,
      metrics: [
        {
          name: 'Revenue',
          value: '$280K',
          calculationType: 'year',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Users',
          value: 3800,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Team Size',
          value: 8,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'TechnicalExpertise',
    config: {
      title: 'Technical Expertise',
      subtitle: 'Full-stack development',
      textIcon: null,
      imageUrl: '/icons/vscode-icons/file_type_js_official.svg',
      imagePlacement: 'left',
      padding: 16,
      border: true,
      borderWidth: 1,
      borderRadius: 8,
      color: '#000000',
      accentColor: '#ca8a04',
      backgroundColor: '#ffffff',
      watermark: true,
      metrics: [
        {
          name: 'Technologies',
          value: 16,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Architecture',
          value: 'Expert',
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 2,
        },
        {
          name: 'Complexity',
          value: 9.1,
          calculationType: 'total',
          valueDecimalPrecision: 1,
          order: 3,
        },
      ],
    },
  },
  {
    name: 'AIResearchProgress',
    config: {
      title: 'AI Research',
      subtitle: 'Deep learning & NLP',
      textIcon: null,
      imageUrl: '/icons/flat-color-icons/mind_map.svg',
      imagePlacement: 'right',
      padding: 22,
      border: true,
      borderWidth: 0,
      borderRadius: 20,
      color: '#ffffff',
      accentColor: '#22c55e',
      backgroundColor: '#09090b',
      watermark: true,
      metrics: [
        {
          name: 'Models Trained',
          value: 14,
          calculationType: 'year',
          valueDecimalPrecision: 0,
          order: 1,
        },
        {
          name: 'Accuracy',
          value: 98.7,
          calculationType: 'total',
          valueDecimalPrecision: 1,
          order: 2,
        },
        {
          name: 'Research Score',
          value: 86,
          calculationType: 'total',
          valueDecimalPrecision: 0,
          order: 3,
        },
      ],
    },
  },
];

/**
 * Generate a Svelte file from SVG content
 * @param {string} name The widget name
 * @param {string} svgContent The SVG content
 */
function generateSvelteFile(name, svgContent) {
  const filename = `${name}.svg`;
  const filePath = path.join(outputDir, filename);

  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated: ${filename}`);
}

/**
 * Fetch SVG content from the API
 * @param {Object} config The widget configuration
 * @returns {Promise<string>} The SVG content
 */
async function fetchSvgContent(config) {
  try {
    const encodedConfig = encodeURIComponent(
      JSON.stringify({
        ...config,
        imageUrl: config.imageUrl ? 'http://localhost:5173' + config.imageUrl : null,
      })
    );
    const response = await fetch(`${API_URL}?config=${encodedConfig}`);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.svg;
  } catch (error) {
    console.error('Error fetching SVG:', error);
    throw error;
  }
}

/**
 * Main function to generate all widget files
 */
async function generateWidgets() {
  console.log(`Generating ${widgetConfigs.length} widget files in ${outputDir}...`);

  for (const widget of widgetConfigs) {
    try {
      if (!widget.name) {
        console.warn('Skipping widget with no name');
        continue;
      }

      console.log(`Processing widget: ${widget.name}`);
      const svgContent = await fetchSvgContent(widget.config);
      generateSvelteFile(widget.name, svgContent);
    } catch (error) {
      console.error(`Failed to generate widget ${widget.name || 'unnamed'}:`, error);
    }
  }

  console.log('Widget generation complete!');
}

// Check if the dev server is running
// async function checkServerIsRunning() {
//   try {
//     const response = await fetch(API_URL);
//     return response.ok;
//   } catch (error) {
//     return false;
//   }
// }

// Main execution
(async () => {
  try {
    // Check if the dev server is running
    // const serverRunning = await checkServerIsRunning();
    // if (!serverRunning) {
    //   console.error('Error: Dev server is not running. Please start the development server first.');
    //   console.error(`The API endpoint ${API_URL} is not accessible.`);
    //   process.exit(1);
    // }

    await generateWidgets();
  } catch (err) {
    console.error('Widget generation failed:', err);
    process.exit(1);
  }
})();
