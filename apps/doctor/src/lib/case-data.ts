export type MetricStatus = 'Low' | 'Normal' | 'High';

export interface LabMetric {
  name: string;
  result: string;
  referenceRange: string;
  status: MetricStatus;
}

export interface LabSection {
  title: string;
  metrics: LabMetric[];
}

export interface LabResults {
  dateOfTest: string;
  referringPhysician: string;
  clinicalIndications: string;
  sections: LabSection[];
}

export interface CaseData {
  patientName: string;
  patientNote: string;
  aiInsights: string;
  labResults: LabResults;
}

export const MOCK_CASE_DATA: CaseData = {
  patientName: 'Dr. Light',
  patientNote:
    "I've been feeling unusually tired for the past few weeks, even when I get enough rest. My periods have also been irregular lately, and I've noticed mood changes that I can't really explain.\n\nI'm starting to get worried because this isn't normal for me.",
  aiInsights:
    'Patient displays classical symptomatic indicators of severe iron deficiency anaemia, correlated with microcytic erythrocyte metrics found in the haematology panel.',
  labResults: {
    dateOfTest: 'April 27, 2026',
    referringPhysician: 'Dr. A. Bello',
    clinicalIndications: 'Fatigue, dizziness, shortness of breath, headaches',
    sections: [
      {
        title: '1. HAEMATOLOGY',
        metrics: [
          {
            name: 'Haemoglobin (Hb)',
            result: '8.2g/dL',
            referenceRange: '12.0 – 15.5 g/dL',
            status: 'Low',
          },
          {
            name: 'Packed Cell Volume',
            result: '28%',
            referenceRange: '36 – 46%',
            status: 'Low',
          },
          {
            name: 'Red Blood Cell Count',
            result: '3.2 × 10¹²/L',
            referenceRange: '4.0 – 5.2 × 10¹²/L',
            status: 'Low',
          },
          {
            name: 'White Blood Cell Count',
            result: '5.8 × 10⁹/L',
            referenceRange: '4.0 – 11.0 × 10⁹/L',
            status: 'Normal',
          },
        ],
      },
      {
        title: '2. IRON STUDIES',
        metrics: [],
      },
    ],
  },
};
