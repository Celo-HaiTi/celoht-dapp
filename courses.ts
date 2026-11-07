export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "Professional";

export type AcademySchool = {
  id: string;
  title: string;
  description: string;
  focus: string[];
  courses: string[];
};

export type Course = {
  id: string;
  title: string;
  pillar: "education";
  schoolId: string;
  program: string;
  summary: string;
  description: string;
  objectives: string[];
  learningObjectives: string[];
  prerequisites: string[];
  syllabus: string[];
  modules: string[];
  chapters: string[];
  practicalExercises: string[];
  caseStudies: string[];
  homework: string[];
  knowledgeChecks: string[];
  moduleExaminations: string[];
  finalExamination: string;
  finalProject?: string;
  grading: string[];
  interactiveTools: string[];
  durationMinutes: number;
  language: "Haitian Creole" | "English";
  level: CourseLevel;
  tags: string[];
  certificateEligible: boolean;
};

type SchoolProfile = {
  id: string;
  title: string;
  description: string;
  focus: string[];
  courseTitles: string[];
};

type CourseSeed = {
  schoolId: string;
  program: string;
  title: string;
  summary: string;
  description: string;
  level: CourseLevel;
  prerequisites: string[];
  tags: string[];
  durationMinutes: number;
};

const schoolProfiles: SchoolProfile[] = [
  {
    id: "financial-literacy",
    title: "School of Financial Literacy",
    description: "Personal money management, household budgeting, savings habits, debt literacy, and decision-making under uncertainty.",
    focus: ["Budgeting", "Savings", "Credit literacy"],
    courseTitles: [
      "Money Foundations",
      "Household Budget Design",
      "Savings Discipline",
      "Debt and Interest Mechanics",
      "Emergency Reserves",
      "Inflation and Purchasing Power",
      "Banking Systems",
      "Cash Flow Planning",
      "Financial Goal Setting",
      "Financial Readiness for Life Stages",
    ],
  },
  {
    id: "blockchain-web3",
    title: "School of Blockchain and Web3",
    description: "Distributed systems, blockchain architecture, digital trust, and the building blocks of decentralized applications.",
    focus: ["Blockchain", "Consensus", "Web3"],
    courseTitles: [
      "Blockchain Foundations",
      "Distributed Ledger Design",
      "Cryptography and Signing",
      "Smart Contracts Basics",
      "Wallets and Identity",
      "Consensus Models",
      "Layer 1 and Layer 2",
      "Decentralized Applications",
      "Token Design Principles",
      "Network Security Basics",
    ],
  },
  {
    id: "cryptocurrency",
    title: "School of Cryptocurrency",
    description: "Digital assets, major crypto networks, economic concepts, custody basics, and responsible participation in the ecosystem.",
    focus: ["Crypto basics", "Networks", "Tokenomics"],
    courseTitles: [
      "Crypto Fundamentals",
      "Bitcoin Economics",
      "Ethereum Architecture",
      "Stablecoin Structures",
      "Tokenomics Overview",
      "Digital Asset Custody",
      "Wallet Security Patterns",
      "Market Cycles",
      "Crypto Governance Models",
      "Responsible Crypto Participation",
    ],
  },
  {
    id: "crypto-trading",
    title: "School of Crypto Trading",
    description: "Technical reading, risk management, trading psychology, market structure, and disciplined execution in digital asset markets.",
    focus: ["Chart reading", "Risk control", "Execution"],
    courseTitles: [
      "Trading Foundations",
      "Market Structure",
      "Candlestick Analysis",
      "Trend and Momentum",
      "Risk Management",
      "Portfolio Sizing",
      "Order Types",
      "Sentiment and Liquidity",
      "Backtesting Methodology",
      "Trading Discipline",
    ],
  },
  {
    id: "investment-portfolio",
    title: "School of Investment and Portfolio Management",
    description: "Portfolio design, long-term investing, valuation thinking, risk diversification, and disciplined capital allocation.",
    focus: ["Investing", "Diversification", "Valuation"],
    courseTitles: [
      "Investment Foundations",
      "Asset Allocation",
      "Diversification Strategies",
      "Return and Risk",
      "Valuation Mindset",
      "Portfolio Rebalancing",
      "Behavioral Finance",
      "Long-Term Strategy",
      "Investment Research",
      "Portfolio Review Practices",
    ],
  },
  {
    id: "defi",
    title: "School of Decentralized Finance",
    description: "Liquidity, lending, borrowing, automated markets, stable pools, staking, and the core logic behind on-chain finance.",
    focus: ["DeFi mechanics", "Liquidity", "Yield"],
    courseTitles: [
      "DeFi Fundamentals",
      "Liquidity Pools",
      "Borrowing and Lending",
      "Yield Strategies",
      "Staking Models",
      "AMMs and Routing",
      "DeFi Risk Controls",
      "Stablecoin Yield",
      "Protocol Design Basics",
      "On-Chain Risk Review",
    ],
  },
  {
    id: "digital-payments",
    title: "School of Digital Banking and Payments",
    description: "Digital payment rails, transaction systems, settlement flows, regulated finance, and inclusive financial infrastructure.",
    focus: ["Payments", "Settlement", "Banking rails"],
    courseTitles: [
      "Digital Payments Overview",
      "Account Structures",
      "Settlement Basics",
      "Cross-Border Payments",
      "Stablecoin Use Cases",
      "Merchant Finance",
      "Payment Fraud Prevention",
      "Digital Wallet Flows",
      "Inclusive Finance",
      "Transaction Compliance",
    ],
  },
  {
    id: "cybersecurity",
    title: "School of Cybersecurity and Digital Asset Protection",
    description: "Safety practices for digital financial life, wallet protection, social engineering awareness, and controlled digital access.",
    focus: ["Security", "Fraud prevention", "Privacy"],
    courseTitles: [
      "Digital Security Basics",
      "Wallet Protection",
      "Phishing Defense",
      "Private Keys and Recovery",
      "Mobile Device Security",
      "Social Engineering Awareness",
      "Access Control",
      "Seed Phrase Safety",
      "Fraud Investigation",
      "Digital Risk Hygiene",
    ],
  },
  {
    id: "entrepreneurship",
    title: "School of Business and Entrepreneurship",
    description: "Business plans, venture design, financial modeling, growth strategy, and sustainable digital business creation.",
    focus: ["Business models", "Strategy", "Growth"],
    courseTitles: [
      "Entrepreneurial Thinking",
      "Business Model Design",
      "Customer Discovery",
      "Revenue Planning",
      "Cost and Unit Economics",
      "Growth Strategy",
      "Marketing and Positioning",
      "Fundraising Readiness",
      "Operations and Controls",
      "Launch Planning",
    ],
  },
  {
    id: "fintech-innovation",
    title: "School of Financial Technology and Innovation",
    description: "Digital transformation in finance, product design, data systems, and the institutional logic behind modern fintech tools.",
    focus: ["Fintech design", "Data", "Product"],
    courseTitles: [
      "Fintech Foundations",
      "Customer Journey Design",
      "Product Discovery",
      "Data for Finance",
      "Operational Automation",
      "AI in Finance",
      "KYC and Compliance Systems",
      "Digital Trust Design",
      "Service Design in Finance",
      "Innovation Governance",
    ],
  },
  {
    id: "celo-ecosystem",
    title: "School of Celo Ecosystem and Applications",
    description: "Celo network understanding, wallet experiences, inclusion strategies, and digital finance product thinking in an open ecosystem.",
    focus: ["Celo", "Mobile finance", "Ecosystem"],
    courseTitles: [
      "Celo Ecosystem Overview",
      "Celo Network Architecture",
      "Mobile Money and Inclusion",
      "Wallet Flow Design",
      "Stable Value in Practice",
      "On-Chain Identity",
      "Ecosystem Governance",
      "Community Growth Models",
      "Open Finance Product Design",
      "Celo Use Case Planning",
    ],
  },
  {
    id: "tax-compliance",
    title: "School of Tax, Compliance and Financial Regulation",
    description: "Tax obligations, regulatory reasoning, reporting standards, and the practical responsibilities of financial compliance.",
    focus: ["Tax", "Compliance", "Regulation"],
    courseTitles: [
      "Tax Fundamentals",
      "Income and Expense Records",
      "Tax Planning Basics",
      "Reporting Standards",
      "Compliance Risk",
      "AML and KYC Basics",
      "Digital Finance Regulation",
      "Auditable Records",
      "Remittance and Reporting",
      "Compliance Decision Making",
    ],
  },
  {
    id: "sustainable-impact",
    title: "School of Sustainable Finance and Impact",
    description: "Climate and social impact measurement, sustainable investment logic, and the connection between finance and public value.",
    focus: ["Impact", "Climate", "Sustainability"],
    courseTitles: [
      "Sustainable Finance Basics",
      "Impact Measurement",
      "Climate Risk",
      "ESG Principles",
      "Nature and Finance",
      "Resilience Planning",
      "Community Capital",
      "Impact Reporting",
      "Green Investment Logic",
      "Sustainable Growth Models",
    ],
  },
  {
    id: "digital-identity",
    title: "School of Digital Identity and Trust",
    description: "Identity verification, credentials, personal data control, digital trust systems, and privacy-by-design thinking.",
    focus: ["Identity", "Privacy", "Trust"],
    courseTitles: [
      "Digital Identity Foundations",
      "Credentials and Proofs",
      "Privacy by Design",
      "Authentication Models",
      "Identity Portability",
      "Reputation and Trust",
      "Fraud and Identity Risk",
      "Consent and Data Rights",
      "Identity in Finance",
      "Identity Governance",
    ],
  },
  {
    id: "risk-management",
    title: "School of Risk Management and Financial Resilience",
    description: "Risk identification, mitigation strategies, scenario analysis, and institutional planning for uncertain conditions.",
    focus: ["Risk", "Scenario planning", "Resilience"],
    courseTitles: [
      "Risk Foundations",
      "Operational Risk",
      "Market Risk Basics",
      "Credit Risk Review",
      "Scenario Analysis",
      "Stress Testing",
      "Resilience Planning",
      "Contingency Design",
      "Loss Prevention",
      "Risk Governance",
    ],
  },
];

const courseSeedMap = new Map<string, Record<string, CourseSeed>>();

function createCourseRecord(seed: CourseSeed): Course {
  const moduleTitles = [
    "Academic introduction",
    "Core concepts",
    "Worked examples",
    "Practical exercises",
    "Assessment and reflection",
  ];

  const courseObjectives = [
    `Explain the foundations of ${seed.title.toLowerCase()} in practical financial and institutional contexts.`,
    `Apply analytical thinking to real decision-making in ${seed.program.toLowerCase()} scenarios.`,
    `Use ethical, evidence-based reasoning when evaluating options and trade-offs.`,
    `Connect theory to actions, calculations, and professional decision-making.`,
  ];

  const syllabusItems = [
    "Detailed academic introduction and institutional context.",
    "Core theoretical frameworks and defining concepts.",
    "Real-world financial examples and practical case analysis.",
    "Structured exercises, calculations, and applied problem solving.",
    "Homework, reflection tasks, and guided review.",
    "Module examination and final assessment structure.",
  ];

  const practicalExercises = [
    `Complete a guided scenario exercise on ${seed.title.toLowerCase()} using realistic numbers and decision paths.`,
    `Prepare a short comparative analysis of at least two options in a real-world case study.`,
    `Create a personal worksheet that converts theory into an action plan with measurable outcomes.`,
    `Review an institutional example and explain the most important control, decision, or trade-off.`,
  ];

  const caseStudies = [
    `Case study: assess a practical challenge in ${seed.program.toLowerCase()} and identify the governing risk or opportunity.`,
    `Case study: compare short-term tactics with long-term strategy under realistic operating constraints.`,
    `Case study: measure how choices affect financial outcomes, trust, or institutional resilience.`,
  ];

  const homeworkItems = [
    "Submit written notes explaining the key concepts and their practical relevance.",
    "Complete a structured workbook assignment using the formulas, frameworks, and examples from the course.",
    "Prepare a brief recommendation memo based on a realistic scenario and supporting evidence.",
  ];

  const knowledgeChecks = [
    "Short knowledge check after each module to confirm comprehension.",
    "Scenario reflection questions linked to real financial decisions.",
    "Timed assessment covering the core concepts and applied reasoning.",
  ];

  const moduleExaminations = [
    "Module review quiz with practical and analytical questions.",
    "Short written analysis requiring interpretation of a financial case.",
    "Applied calculations and decision log showing reasoning quality.",
  ];

  const gradingOutline = [
    "Class participation and written engagement: 15%",
    "Homework and applied assignments: 25%",
    "Module examinations: 25%",
    "Final assessment and project: 35%",
  ];

  const interactiveTools = [
    "Decision matrix",
    "Scenario calculator",
    "Risk-reward comparison sheet",
    "Portfolio allocation exercise",
    "Financial simulation worksheet",
  ];

  const finalProject = `Prepare a final applied project in ${seed.program.toLowerCase()} showing analysis, calculations, recommendations, and a clear implementation plan.`;

  const chapters = moduleTitles.map((title, index) => `${index + 1}. ${title}`);

  return {
    id: `${seed.schoolId}-${slugify(seed.title)}`,
    title: seed.title,
    pillar: "education",
    schoolId: seed.schoolId,
    program: seed.program,
    summary: seed.summary,
    description: seed.description,
    objectives: courseObjectives,
    learningObjectives: courseObjectives,
    prerequisites: seed.prerequisites,
    syllabus: syllabusItems,
    modules: moduleTitles,
    chapters,
    practicalExercises,
    caseStudies,
    homework: homeworkItems,
    knowledgeChecks,
    moduleExaminations,
    finalExamination: "Final examination covering analysis, financial calculations, case interpretation, and decision-making justification.",
    finalProject,
    grading: gradingOutline,
    interactiveTools,
    durationMinutes: seed.durationMinutes,
    language: "Haitian Creole",
    level: seed.level,
    tags: seed.tags,
    certificateEligible: true,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

schoolProfiles.forEach((school) => {
  const entries = school.courseTitles.map((title, index) => {
    const previousCourse = index > 0 ? school.courseTitles[index - 1] : "Foundational course study";
    const seed: CourseSeed = {
      schoolId: school.id,
      program: school.title.replace(/^School of /, ""),
      title,
      summary: `Develop practical understanding of ${title.toLowerCase()} through structured academic analysis, applied exercises, and real-world case thinking.`,
      description: `This course provides a rigorous academic introduction to ${title.toLowerCase()} and links theory to practical financial and operational decisions in real institutions and everyday life.`,
      level: ["Beginner", "Beginner", "Intermediate", "Intermediate", "Advanced", "Advanced", "Professional", "Professional", "Advanced", "Professional"][index] as CourseLevel,
      prerequisites: index === 0 ? ["None"] : [previousCourse],
      tags: [school.id.replace(/-/g, " "), title.toLowerCase(), "applied learning"],
      durationMinutes: 120 + (index * 15),
    };

    return [title, createCourseRecord(seed)] as const;
  });

  courseSeedMap.set(school.id, Object.fromEntries(entries) as Record<string, CourseSeed>);
});

const schoolCatalog: Record<string, Course[]> = Object.fromEntries(
  schoolProfiles.map((school) => {
    const records = school.courseTitles.map((title, index) => {
      const previousCourse = index > 0 ? school.courseTitles[index - 1] : "Foundational course study";
      const seed: CourseSeed = {
        schoolId: school.id,
        program: school.title.replace(/^School of /, ""),
        title,
        summary: `Develop practical understanding of ${title.toLowerCase()} through structured academic analysis, applied exercises, and real-world case thinking.`,
        description: `This course provides a rigorous academic introduction to ${title.toLowerCase()} and links theory to practical financial and operational decisions in real institutions and everyday life.`,
        level: ["Beginner", "Beginner", "Intermediate", "Intermediate", "Advanced", "Advanced", "Professional", "Professional", "Advanced", "Professional"][index] as CourseLevel,
        prerequisites: index === 0 ? ["None"] : [previousCourse],
        tags: [school.id.replace(/-/g, " "), title.toLowerCase(), "applied learning"],
        durationMinutes: 120 + (index * 15),
      };
      return createCourseRecord(seed);
    });

    return [school.id, records];
  }),
);

export const academySchools: AcademySchool[] = schoolProfiles.map((school) => ({
  id: school.id,
  title: school.title,
  description: school.description,
  focus: school.focus,
  courses: schoolCatalog[school.id].map((course) => course.id),
}));

export const courses: Course[] = Object.values(schoolCatalog).flat();
export const academyCourseCount = courses.length;
export const academyAdditionalCourses = 0;
export const academyAdditionalModules = 0;
export const academyModuleCount = courses.reduce((total, course) => total + course.modules.length, 0);
