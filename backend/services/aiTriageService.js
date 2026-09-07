// Local AI Triage Engine
// Analyzes sanitation complaints without requiring an external API.

const ISSUE_PATTERNS = {
  'Garbage Accumulation': [
    'garbage',
    'trash',
    'waste',
    'dump',
    'litter',
    'rubbish',
    'garbage pile',
    'waste pile',
    'dustbin overflowing'
  ],

  'Sewage / Drainage': [
    'sewage',
    'drain',
    'drainage',
    'overflow',
    'overflowing',
    'blocked drain',
    'sewer',
    'gutter',
    'dirty water'
  ],

  'Street Cleaning': [
    'street dirty',
    'road dirty',
    'unclean road',
    'cleaning',
    'sweeping',
    'dirty street'
  ],

  'Dead Animal': [
    'dead animal',
    'dead dog',
    'dead cat',
    'carcass'
  ]
};

const CRITICAL_KEYWORDS = [
  'emergency',
  'dangerous',
  'health hazard',
  'disease',
  'hospital',
  'school',
  'children',
  'toxic',
  'severe',
  'critical'
];

const HIGH_KEYWORDS = [
  'overflowing',
  'overflow',
  'blocked',
  'sewage',
  'huge',
  'large',
  'many people',
  'bad smell',
  'mosquito',
  'urgent'
];

const MEDIUM_KEYWORDS = [
  'dirty',
  'garbage',
  'waste',
  'trash',
  'clean',
  'litter'
];

export function analyzeComplaint({
  description = '',
  issue_type = '',
  location = ''
}) {
  const text = `${description} ${issue_type} ${location}`.toLowerCase();

  let detectedIssue = issue_type || 'General Sanitation Issue';
  let maxMatches = 0;

  // Detect issue category
  for (const [category, keywords] of Object.entries(ISSUE_PATTERNS)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      detectedIssue = category;
    }
  }

  // Calculate priority score
  let score = 0;
  const detectedRisks = [];

  for (const keyword of CRITICAL_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 4;
      detectedRisks.push(keyword);
    }
  }

  for (const keyword of HIGH_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 2;
      detectedRisks.push(keyword);
    }
  }

  for (const keyword of MEDIUM_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 1;
    }
  }

  let priority = 'Low';

  if (score >= 7) {
    priority = 'Critical';
  } else if (score >= 4) {
    priority = 'High';
  } else if (score >= 2) {
    priority = 'Medium';
  }

  // Generate explanation
  let reason;

  if (priority === 'Critical') {
    reason =
      `Potential public health risk detected due to: ${detectedRisks.join(', ')}. Immediate municipal attention is recommended.`;
  } else if (priority === 'High') {
    reason =
      `High-priority sanitation issue detected. Risk factors include: ${detectedRisks.join(', ') || 'multiple sanitation concerns'}.`;
  } else if (priority === 'Medium') {
    reason =
      'Moderate sanitation issue detected. The complaint should be assigned for routine resolution.';
  } else {
    reason =
      'Low-severity sanitation issue detected. The complaint can be scheduled for regular maintenance.';
  }

  // Recommended action
  let recommendedAction;

  switch (detectedIssue) {
    case 'Sewage / Drainage':
      recommendedAction =
        'Assign drainage and sanitation team for inspection and clearing.';
      break;

    case 'Garbage Accumulation':
      recommendedAction =
        'Assign waste collection team and clear the affected area.';
      break;

    case 'Dead Animal':
      recommendedAction =
        'Dispatch sanitation team for immediate safe removal.';
      break;

    case 'Street Cleaning':
      recommendedAction =
        'Assign street cleaning team for scheduled cleaning.';
      break;

    default:
      recommendedAction =
        'Assign the appropriate municipal sanitation team for inspection.';
  }

  return {
    category: detectedIssue,
    priority,
    score,
    reason,
    recommendedAction,
    detectedRisks
  };
}