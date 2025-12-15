// Mock data for the eConsultation Sentiment Analyzer prototype

export interface Comment {
  id: string
  stakeholder: string
  stakeholderType: "Individual" | "Organization" | "Government" | "NGO"
  provision: string
  text: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  summary: string
  keywords: string[]
  date: string
  flagged: boolean
  notes: string
  includeInReport: boolean
}

export const mockComments: Comment[] = [
  {
    id: "1",
    stakeholder: "Citizens for Privacy Rights",
    stakeholderType: "NGO",
    provision: "Section 4.2 - Data Collection",
    text: "We strongly support the proposed limitations on data collection by government agencies. This provision strikes the right balance between security needs and privacy rights. The requirement for judicial oversight is particularly commendable and will help prevent overreach.",
    sentiment: "positive",
    confidence: 0.89,
    summary: "Strong support for data collection limitations and judicial oversight requirements.",
    keywords: ["privacy", "judicial oversight", "data collection", "balance"],
    date: "2024-01-15",
    flagged: false,
    notes: "",
    includeInReport: true,
  },
  {
    id: "2",
    stakeholder: "Tech Industry Association",
    stakeholderType: "Organization",
    provision: "Section 7.1 - Compliance Requirements",
    text: "The proposed compliance framework is overly burdensome and will stifle innovation. Small startups cannot afford the extensive auditing requirements outlined in this section. We recommend a tiered approach based on company size and data volume.",
    sentiment: "negative",
    confidence: 0.92,
    summary: "Objects to compliance framework as burdensome, suggests tiered approach.",
    keywords: ["compliance", "burdensome", "innovation", "startups", "tiered approach"],
    date: "2024-01-14",
    flagged: true,
    notes: "Industry concern - consider economic impact",
    includeInReport: true,
  },
  {
    id: "3",
    stakeholder: "Dr. Sarah Mitchell",
    stakeholderType: "Individual",
    provision: "Section 3.5 - Consent Mechanisms",
    text: "The consent mechanisms described are adequate but could be clearer for average users. Consider adding visual examples or simplified language to help citizens understand what they are agreeing to.",
    sentiment: "neutral",
    confidence: 0.76,
    summary: "Suggests improvements to consent mechanism clarity for users.",
    keywords: ["consent", "clarity", "visual examples", "simplified language"],
    date: "2024-01-13",
    flagged: false,
    notes: "",
    includeInReport: true,
  },
  {
    id: "4",
    stakeholder: "Digital Rights Foundation",
    stakeholderType: "NGO",
    provision: "Section 2.3 - Enforcement Powers",
    text: "We are deeply concerned about the broad enforcement powers granted to regulatory agencies. The lack of clear appeals process and the potential for arbitrary enforcement actions pose serious risks to civil liberties.",
    sentiment: "negative",
    confidence: 0.94,
    summary: "Concerned about broad enforcement powers and lack of appeals process.",
    keywords: ["enforcement", "regulatory agencies", "appeals process", "civil liberties"],
    date: "2024-01-12",
    flagged: true,
    notes: "Civil liberties concern - high priority",
    includeInReport: true,
  },
  {
    id: "5",
    stakeholder: "Municipal Government Coalition",
    stakeholderType: "Government",
    provision: "Section 6.4 - Implementation Timeline",
    text: "The 18-month implementation timeline is realistic and provides adequate time for local governments to adapt their systems. We appreciate the phased rollout approach and the technical support provisions.",
    sentiment: "positive",
    confidence: 0.87,
    summary: "Supports 18-month timeline and phased rollout approach.",
    keywords: ["implementation", "timeline", "phased rollout", "technical support"],
    date: "2024-01-11",
    flagged: false,
    notes: "",
    includeInReport: true,
  },
  {
    id: "6",
    stakeholder: "Consumer Protection Alliance",
    stakeholderType: "NGO",
    provision: "Section 5.1 - User Rights",
    text: "The user rights section is comprehensive and well-structured. The right to data portability and the right to be forgotten are particularly important. However, we suggest adding clearer timelines for response to user requests.",
    sentiment: "positive",
    confidence: 0.83,
    summary: "Praises user rights section, suggests adding response timelines.",
    keywords: ["user rights", "data portability", "right to be forgotten", "response timelines"],
    date: "2024-01-10",
    flagged: false,
    notes: "",
    includeInReport: true,
  },
  {
    id: "7",
    stakeholder: "Small Business Federation",
    stakeholderType: "Organization",
    provision: "Section 8.2 - Penalty Structure",
    text: "The penalty structure is disproportionately harsh for small businesses. A $50,000 fine could bankrupt a small company for a minor compliance error. We urge reconsideration of the penalty amounts for businesses under 50 employees.",
    sentiment: "negative",
    confidence: 0.91,
    summary: "Objects to harsh penalties for small businesses, requests reconsideration.",
    keywords: ["penalties", "small businesses", "disproportionate", "compliance error"],
    date: "2024-01-09",
    flagged: true,
    notes: "Economic impact concern",
    includeInReport: true,
  },
  {
    id: "8",
    stakeholder: "Prof. Michael Chen",
    stakeholderType: "Individual",
    provision: "Section 1.2 - Definitions",
    text: "The definitions section provides good clarity on key terms. The distinction between personal data and sensitive personal data is well articulated and aligns with international standards.",
    sentiment: "positive",
    confidence: 0.79,
    summary: "Commends clarity of definitions and alignment with international standards.",
    keywords: ["definitions", "personal data", "sensitive data", "international standards"],
    date: "2024-01-08",
    flagged: false,
    notes: "",
    includeInReport: true,
  },
  {
    id: "9",
    stakeholder: "Healthcare Data Consortium",
    stakeholderType: "Organization",
    provision: "Section 9.3 - Special Categories",
    text: "The special provisions for healthcare data are insufficient. Medical research requires more flexibility in data use than currently proposed. The current framework could significantly impede medical advancement and patient care.",
    sentiment: "negative",
    confidence: 0.88,
    summary: "Criticizes healthcare data provisions as insufficient for medical research.",
    keywords: ["healthcare data", "medical research", "flexibility", "patient care"],
    date: "2024-01-07",
    flagged: true,
    notes: "Healthcare sector concern",
    includeInReport: true,
  },
  {
    id: "10",
    stakeholder: "Privacy Advocacy Group",
    stakeholderType: "NGO",
    provision: "Section 4.1 - Data Minimization",
    text: "The data minimization principle is well-implemented throughout the legislation. The requirement to justify data collection purposes and regularly review data retention policies demonstrates a commitment to privacy-by-design.",
    sentiment: "positive",
    confidence: 0.86,
    summary: "Praises data minimization implementation and privacy-by-design approach.",
    keywords: ["data minimization", "privacy-by-design", "data retention", "justification"],
    date: "2024-01-06",
    flagged: false,
    notes: "",
    includeInReport: true,
  },
]

export const sentimentStats = {
  positive: mockComments.filter((c) => c.sentiment === "positive").length,
  negative: mockComments.filter((c) => c.sentiment === "negative").length,
  neutral: mockComments.filter((c) => c.sentiment === "neutral").length,
  total: mockComments.length,
}

export const topKeywords = [
  { word: "privacy", count: 8 },
  { word: "data", count: 12 },
  { word: "compliance", count: 6 },
  { word: "enforcement", count: 5 },
  { word: "rights", count: 7 },
  { word: "implementation", count: 4 },
  { word: "oversight", count: 3 },
  { word: "penalties", count: 4 },
  { word: "businesses", count: 5 },
  { word: "protection", count: 6 },
]

export const provisionStats = [
  { provision: "Section 4.2 - Data Collection", comments: 3, avgSentiment: 0.2 },
  { provision: "Section 7.1 - Compliance Requirements", comments: 2, avgSentiment: -0.6 },
  { provision: "Section 3.5 - Consent Mechanisms", comments: 1, avgSentiment: 0.0 },
  { provision: "Section 2.3 - Enforcement Powers", comments: 2, avgSentiment: -0.8 },
  { provision: "Section 6.4 - Implementation Timeline", comments: 1, avgSentiment: 0.8 },
  { provision: "Section 5.1 - User Rights", comments: 1, avgSentiment: 0.7 },
]
