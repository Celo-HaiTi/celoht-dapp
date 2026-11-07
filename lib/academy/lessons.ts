export type LessonQuestionType = "multiple-choice" | "true-false" | "number" | "short-answer";

export type LessonQuestion = {
  id: string;
  type: LessonQuestionType;
  prompt: string;
  options?: string[];
  answer: string | number | boolean;
  explanation: string;
};

export type LessonStage = {
  id: string;
  title: string;
  body: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  example?: { title: string; content: string[] };
  questions: LessonQuestion[];
};

export type LessonBlueprint = {
  title: string;
  summary: string;
  stages: LessonStage[];
  passingScore: number;
};

const stageLabels = {
  en: {
    introduction: "Academic Introduction",
    concepts: "Core Concepts",
    examples: "Worked Examples",
    exercises: "Practical Exercises",
    reflection: "Assessment and Reflection",
    completion: "Knowledge Check and Completion",
  },
  ht: {
    introduction: "Entwodiksyon Akademik",
    concepts: "Konsèp esansyèl",
    examples: "Egzanp travay",
    exercises: "Egzèsis Pratik",
    reflection: "Evalyasyon ak Refleksyon",
    completion: "Tès konesans ak konplete",
  },
  es: {
    introduction: "Introducción académica",
    concepts: "Conceptos clave",
    examples: "Ejemplos resueltos",
    exercises: "Ejercicios prácticos",
    reflection: "Evaluación y reflexión",
    completion: "Comprobación de conocimientos y finalización",
  },
  fr: {
    introduction: "Introduction académique",
    concepts: "Concepts clés",
    examples: "Exemples résolus",
    exercises: "Exercices pratiques",
    reflection: "Évaluation et réflexion",
    completion: "Vérification des connaissances et achèvement",
  },
} as const;

function normalizeLanguage(language?: string): keyof typeof stageLabels {
  return language && language in stageLabels ? (language as keyof typeof stageLabels) : "en";
}

function buildHouseholdBudgetLesson(language: string): LessonStage[] {
  const labels = stageLabels[normalizeLanguage(language)];

  return [
    {
      id: "academic-introduction",
      title: labels.introduction,
      body: [
        "A household budget is a plan that matches expected income with the spending and savings needs of a household. It helps families decide what must be paid first, what can be delayed, and how much should be protected for future needs.",
        "Budgeting matters because households must manage both predictable expenses, such as rent, groceries, and school fees, and irregular costs, such as repairs, medical care, and seasonal expenses. A clear budget lowers stress, reduces preventable debt, and supports long-term resilience.",
        "In practical terms, the goal is not to spend less for its own sake. The goal is to allocate money intentionally so essentials are covered, emergency savings are created, and future obligations remain manageable.",
      ],
      bullets: [
        "A household budget answers three questions: How much comes in? What must go out? What remains after essential needs are covered?",
        "An effective plan includes current needs, future obligations, and a buffer for surprises.",
        "Good budgeting is a habit of tracking, adjusting, and revising decisions as conditions change.",
      ],
      questions: [
        {
          id: "budget-definition",
          type: "multiple-choice",
          prompt: "Which statement best defines a household budget?",
          options: [
            "A record of past transactions only",
            "A plan for income, spending, and savings over a period",
            "A debt payment schedule",
          ],
          answer: 1,
          explanation: "A household budget is a forward-looking plan that aligns income with essential spending, savings, and flexibility.",
        },
      ],
    },
    {
      id: "core-concepts",
      title: labels.concepts,
      body: [
        "Household income includes wages, business income, support payments, and other reliable inflows. When building a budget, start by identifying what is regular and what is variable.",
        "Fixed expenses remain similar each month, such as rent, insurance, or utilities. Variable expenses change based on consumption, such as food, transportation, and entertainment. Irregular expenses include school materials, health costs, and maintenance.",
        "Essential spending covers needs such as housing, food, transport, healthcare, and education. Non-essential spending includes leisure, convenience purchases, and discretionary upgrades. A strong household budget protects essential spending before allocating money to discretionary items.",
        "Savings and emergency funds should be treated as a planned expense. Even a small monthly transfer into savings can reduce financial vulnerability. Debt management also matters: high-interest debt can crowd out savings and increase monthly pressure.",
      ],
      bullets: [
        "Income classification: regular, irregular, and opportunistic income.",
        "Expense classification: fixed, variable, irregular, essential, and discretionary.",
        "Priority order: essentials, savings, debt obligations, then flexible spending.",
        "Monitoring: compare actual spending with the plan each week and adjust within the month.",
      ],
      table: {
        headers: ["Category", "Definition", "Example"],
        rows: [
          ["Fixed expense", "Regular amount", "Rent or tuition"],
          ["Variable expense", "Changes with use", "Food or transport"],
          ["Irregular expense", "Occurs occasionally", "Medical bill or school materials"],
          ["Discretionary spending", "Optional spending", "Entertainment or gifts"],
        ],
      },
      questions: [
        {
          id: "expense-classification",
          type: "multiple-choice",
          prompt: "Which category best matches rent?",
          options: ["Variable expense", "Fixed expense", "Discretionary expense"],
          answer: 1,
          explanation: "Rent is usually a fixed expense because the payment amount does not change much from month to month.",
        },
      ],
    },
    {
      id: "worked-examples",
      title: labels.examples,
      body: [
        "A household receives $1,500 each month. The planned expenses are rent ($450), food ($300), transportation ($120), utilities ($100), education ($150), and other expenses ($180). The household's total monthly expenses are $1,300, leaving $200 available for savings or additional needs.",
        "The rent share is 450 ÷ 1,500 = 0.30, so rent consumes 30% of the household income. This is an important indicator because a household should monitor how much of its cash flow is committed to housing and avoid overextending its fixed-cost burden.",
        "If the household reduces other expenses by $50, its surplus becomes $250. That additional $50 can be assigned to emergency savings or debt reduction. The point is that small changes repeated consistently can materially improve cash flow resilience.",
      ],
      table: {
        headers: ["Item", "Amount"],
        rows: [
          ["Income", "$1,500"],
          ["Rent", "$450"],
          ["Food", "$300"],
          ["Transportation", "$120"],
          ["Utilities", "$100"],
          ["Education", "$150"],
          ["Other", "$180"],
          ["Total expenses", "$1,300"],
          ["Remaining", "$200"],
        ],
      },
      questions: [
        {
          id: "budget-calculation",
          type: "number",
          prompt: "What is the total monthly expense in the example above?",
          answer: 1300,
          explanation: "The total is 450 + 300 + 120 + 100 + 150 + 180 = 1,300.",
        },
      ],
    },
    {
      id: "practical-exercises",
      title: labels.exercises,
      body: [
        "Students should create a mini budget using their own or a sample household scenario. Begin with income and list all required expenses before considering optional items. Then assign priorities: essentials before discretionary spending, savings before lifestyle upgrades, and debt payments before non-essential consumption.",
        "A realistic exercise could compare a household with income of $2,200 and mandatory costs of $1,650. The remaining $550 requires deliberate allocation across emergency savings, debt reduction, and flexible spending. This helps students learn how trade-offs work in practice.",
        "Budgeting is not a one-time calculation. The plan should be reviewed every week or month to see whether spending is staying within the budget and whether any category needs revision.",
      ],
      bullets: [
        "Write down all monthly income sources and total them.",
        "List fixed, variable, and irregular expenses.",
        "Separate essentials from wants.",
        "Assign a minimum savings target and an emergency buffer.",
      ],
      questions: [
        {
          id: "budget-priority",
          type: "multiple-choice",
          prompt: "Which spending should usually be prioritized first?",
          options: [
            "Entertainment",
            "Emergency savings and essential needs",
            "Luxury items",
          ],
          answer: 1,
          explanation: "Funding essentials and emergency savings protects a household from preventable financial shocks.",
        },
      ],
    },
    {
      id: "assessment-and-reflection",
      title: labels.reflection,
      body: [
        "Reflection helps students judge whether the budget is realistic and whether their spending choices align with household priorities. A household that spends too much on optional categories may struggle to absorb irregular expenses or recover from income loss.",
        "Good budgets are not rigid. They are tools for adaptation. When new costs appear, the household adjusts spending categories, revisits savings targets, or pauses discretionary spending to preserve stability.",
        "The best household budgets do three things at once: they protect essentials, they create a safety cushion, and they keep debt manageable. That structure is the foundation of household financial resilience.",
      ],
      bullets: [
        "Why does an emergency fund matter for a household?",
        "What changes would you make if income drops by 10%?",
        "Which expense category should be reduced first when a household faces a shortfall?",
      ],
      questions: [
        {
          id: "emergency-fund",
          type: "short-answer",
          prompt: "Explain in one or two sentences why an emergency fund matters for a household.",
          answer: "An emergency fund protects the household from unexpected costs and income shocks without forcing a sudden jump into debt.",
          explanation: "Emergency funds help households absorb disruptions such as illness, repair costs, or temporary income loss without falling behind on essentials.",
        },
      ],
    },
    {
      id: "knowledge-check-and-completion",
      title: labels.completion,
      body: [
        "To complete the lesson, you must answer the required questions and meet the minimum passing threshold of 80%. Review the materials above, calculate carefully, and apply the logic to the household scenario before submitting your final answers.",
        "This lesson is complete when you can explain the difference between fixed and variable costs, calculate a monthly surplus, and link the household budget to resilience and debt control.",
      ],
      questions: [
        {
          id: "household-surplus",
          type: "number",
          prompt: "A household earns $1,500 and spends $1,300. How much money remains for saving or other goals?",
          answer: 200,
          explanation: "The remaining amount is 1,500 - 1,300 = 200.",
        },
        {
          id: "rent-share",
          type: "number",
          prompt: "If rent is $450 on a $1,500 income, what percentage of income is spent on rent?",
          answer: 30,
          explanation: "450 ÷ 1,500 = 0.30, so the household spends 30% of its income on rent.",
        },
        {
          id: "budget-true-false",
          type: "true-false",
          prompt: "A household should prioritize essential spending before discretionary spending.",
          answer: true,
          explanation: "This is a core principle of effective household budgeting because essential needs must be protected first.",
        },
      ],
    },
  ];
}

function inferTopicDefinition(title: string): {
  definition: string;
  whyItMatters: string;
  components: string[];
  example: string;
  metricLabel: string;
  keyQuestion: string;
} {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("budget") || lowerTitle.includes("cash flow") || lowerTitle.includes("finance")) {
    return {
      definition: "A household budget is a plan for income, essential spending, savings, and future obligations over a defined period.",
      whyItMatters: "It helps households match inflows with obligations, reduce avoidable debt, and protect stability during shocks.",
      components: ["Income sources", "Fixed expenses", "Variable expenses", "Savings and emergency reserves", "Debt commitments"],
      example: "A family with $2,400 monthly income can assign $1,000 to housing, $500 to food, $300 to transport, $200 to savings, and the remainder to debt or flexible needs.",
      metricLabel: "monthly surplus",
      keyQuestion: "What is the difference between essential spending and discretionary spending?",
    };
  }

  if (lowerTitle.includes("risk") || lowerTitle.includes("resilience") || lowerTitle.includes("security")) {
    return {
      definition: "Risk is the chance that a decision leads to harm, losses, or unexpected outcomes, while resilience is the ability to absorb those outcomes.",
      whyItMatters: "Risk management helps people make safer decisions before losses become expensive or disruptive.",
      components: ["Exposure", "Probability", "Impact", "Mitigation", "Monitoring"],
      example: "A borrower who cannot repay a loan on time faces default risk and should plan a safer repayment schedule earlier.",
      metricLabel: "risk exposure",
      keyQuestion: "Which action reduces risk most effectively: ignoring the issue, measuring it, or escalating it without a plan?",
    };
  }

  if (lowerTitle.includes("wallet") || lowerTitle.includes("payments") || lowerTitle.includes("transaction")) {
    return {
      definition: "A digital payment or wallet flow moves value through a trusted system while recording the transaction and verifying the recipient.",
      whyItMatters: "Clear payment design reduces errors, fraud, and confusion in real transfers of money or value.",
      components: ["Sender", "Recipient", "Amount", "Network", "Confirmation"],
      example: "Before approving a payment, a user must confirm the address, asset, amount, and network to prevent sending funds to the wrong destination.",
      metricLabel: "confirmation status",
      keyQuestion: "Why is confirming the amount and destination before signing a transaction important?",
    };
  }

  if (lowerTitle.includes("blockchain") || lowerTitle.includes("crypto") || lowerTitle.includes("web3") || lowerTitle.includes("ledger")) {
    return {
      definition: "A blockchain is a shared digital ledger that records transactions across a network so participants can verify the historical record without relying on one central authority.",
      whyItMatters: "It improves transparency, reduces reliance on single institutions, and changes how value and ownership are transferred digitally.",
      components: ["Distributed record", "Consensus", "Validation", "Ownership proof", "Network rules"],
      example: "A wallet sends a transaction to the network, validators confirm it, and the transaction becomes part of the shared record.",
      metricLabel: "consensus confidence",
      keyQuestion: "What does a public blockchain record and why is it useful?",
    };
  }

  if (lowerTitle.includes("identity") || lowerTitle.includes("trust") || lowerTitle.includes("privacy")) {
    return {
      definition: "Digital identity is the set of claims, credentials, and controls that help a person or entity prove who they are and manage their digital trust safely.",
      whyItMatters: "Trust depends on accurate identity, clear permissions, and privacy safeguards that reduce fraud and misuse.",
      components: ["Credentials", "Authentication", "Consent", "Verification", "Privacy control"],
      example: "A user may prove identity with a verified account, but should never expose a private key or recovery phrase to anyone.",
      metricLabel: "trust confidence",
      keyQuestion: "What is the difference between a public address and a private secret?",
    };
  }

  if (lowerTitle.includes("invest") || lowerTitle.includes("portfolio") || lowerTitle.includes("asset") || lowerTitle.includes("allocation")) {
    return {
      definition: "Investment is the allocation of current resources with the expectation of future value, income, or strategic benefit over time.",
      whyItMatters: "Investment decisions balance return, time horizon, risk, and diversification so capital is not exposed without a plan.",
      components: ["Capital allocation", "Return expectation", "Risk tolerance", "Diversification", "Review cycle"],
      example: "A household that saves regularly may allocate part of its portfolio to low-risk assets and another part to longer-term growth assets.",
      metricLabel: "expected return",
      keyQuestion: "Why is diversification important when selecting investments?",
    };
  }

  if (lowerTitle.includes("debt") || lowerTitle.includes("loan") || lowerTitle.includes("credit")) {
    return {
      definition: "Debt is money borrowed today that must be repaid later, often with interest and an agreed schedule.",
      whyItMatters: "Debt can unlock opportunities, but it also creates obligations that must be managed carefully to avoid financial stress.",
      components: ["Principal", "Interest", "Repayment schedule", "Risk of default", "Total cost"],
      example: "A person borrowing $1,000 at 10% interest will owe more than $1,000 by the time the loan is repaid, depending on the term.",
      metricLabel: "total repayment cost",
      keyQuestion: "Why should a borrower compare the total repayment cost, not only the amount borrowed?",
    };
  }

  if (lowerTitle.includes("savings") || lowerTitle.includes("saving") || lowerTitle.includes("reserve")) {
    return {
      definition: "Saving is the deliberate act of setting aside income for future needs, emergencies, or planned goals instead of spending it immediately.",
      whyItMatters: "Saving creates stability, lowers dependence on debt, and helps people manage predictable and unpredictable shocks.",
      components: ["Income set-aside", "Goal setting", "Time horizon", "Emergency fund", "Habit consistency"],
      example: "An individual who saves $100 each month for 12 months creates a modest reserve that can cover a repair or new expense without taking on debt.",
      metricLabel: "savings rate",
      keyQuestion: "What is the value of a savings habit even when the monthly amount is small?",
    };
  }

  return {
    definition: `The central concept in ${title} is to understand how the topic connects to decisions, trade-offs, evidence, and measurable outcomes in real life.`,
    whyItMatters: `This topic matters because it helps learners evaluate options, reduce avoidable mistakes, and use information to make informed actions.`,
    components: ["Definition", "Key variables", "Decision criteria", "Examples", "Assessment"],
    example: `A student using ${title} should identify the real problem, compare possible actions, and justify a choice based on clear reasoning.`,
    metricLabel: "decision quality",
    keyQuestion: `Why does understanding ${title} improve real-world decision making?`,
  };
}

function buildGenericLesson(courseTitle: string, language: string): LessonStage[] {
  const labels = stageLabels[normalizeLanguage(language)];
  const title = courseTitle || "Academic Course";
  const concept = inferTopicDefinition(title);

  return [
    {
      id: "academic-introduction",
      title: labels.introduction,
      body: [
        `${title} is a structured learning topic focused on a practical definition, a clear decision context, and the skills required to apply the concept responsibly in real life.`,
        concept.definition,
        concept.whyItMatters,
      ],
      bullets: [
        "Explain the topic in plain language.",
        "Connect the idea to a real decision or practical problem.",
        "Prepare to analyze evidence before choosing an answer.",
      ],
      questions: [
        {
          id: `${slugify(title)}-intro`,
          type: "multiple-choice",
          prompt: `Which statement best defines ${title}?`,
          options: [
            concept.definition,
            "A vague idea with no practical purpose.",
            "A set of unrelated words without operational meaning.",
          ],
          answer: 0,
          explanation: "A high-quality definition clarifies the concept, its purpose, and its relevance to real decisions.",
        },
      ],
    },
    {
      id: "core-concepts",
      title: labels.concepts,
      body: [
        `The core concepts behind ${title} explain what variables matter, what decisions are most relevant, and how outcomes are shaped by assumptions and evidence.`,
        `Students should not memorize definitions alone; they should understand how each component affects a real-world decision and why the trade-offs matter.`,
        `A clear understanding of ${title} enables a learner to compare options, identify hidden constraints, and choose a response that fits the situation.`,
      ],
      bullets: concept.components.map((component) => `${component} is a key part of the concept.`),
      table: {
        headers: ["Component", "Why it matters"],
        rows: concept.components.map((item) => [item, "It helps explain the decision context and timing of the outcome."]),
      },
      questions: [
        {
          id: `${slugify(title)}-concepts`,
          type: "true-false",
          prompt: `Understanding the key components of ${title} is essential before making a practical decision.`,
          answer: true,
          explanation: "Real understanding depends on seeing how the parts fit together and affect decisions.",
        },
      ],
    },
    {
      id: "worked-examples",
      title: labels.examples,
      body: [
        `Worked examples show how a learner moves from a definition to a practical case. Instead of only reading theory, the student sees the reasoning, the assumptions, and the final conclusion in context.`,
        concept.example,
        `A good example highlights the problem, the method, and the interpretation of results so the student can explain why the answer is credible.`,
      ],
      table: {
        headers: ["Step", "What is being tested"],
        rows: [
          ["1", "Define the problem and the decision context"],
          ["2", "Identify the relevant variables or constraints"],
          ["3", "Apply the concept or method"],
          ["4", "Explain the outcome and what it means"],
        ],
      },
      questions: [
        {
          id: `${slugify(title)}-example`,
          type: "multiple-choice",
          prompt: `What is the main value of a worked example in ${title}?`,
          options: [
            "To show the reasoning behind the answer",
            "To skip all analysis",
            "To replace assessment",
          ],
          answer: 0,
          explanation: "Worked examples make the logic transparent so students can apply the concept in new situations.",
        },
      ],
    },
    {
      id: "practical-exercises",
      title: labels.exercises,
      body: [
        `Practical exercises require a learner to apply the concept in a realistic scenario. This is where theory becomes useful because the learner must decide, explain, calculate, or compare based on evidence.`,
        `Students should write assumptions, identify the key variables, and explain their reasoning in their own words before choosing a final answer.`,
        `A realistic exercise is stronger than a vague theory answer because it shows whether the learner can use the concept in context.`,
      ],
      bullets: [
        "Use a realistic scenario or case study.",
        "State the assumptions clearly before making a decision.",
        "Show the reasoning behind the final answer.",
      ],
      questions: [
        {
          id: `${slugify(title)}-exercise`,
          type: "short-answer",
          prompt: `In one or two sentences, explain why ${title} matters in a real-world decision.`,
          answer: `It matters because it gives structure to decisions, helps identify trade-offs, and improves the quality of the final action.`,
          explanation: "Applied exercises test whether the learner can transfer the concept from text to a real decision.",
        },
      ],
    },
    {
      id: "assessment-and-reflection",
      title: labels.reflection,
      body: [
        `Assessment and reflection check whether the learner can explain the concept in their own words, compare alternatives, and justify the final recommendation or action.`,
        `Reflection is important because students can see where their assumptions were strong, where they need more evidence, and how the concept changes when the situation changes.`,
        `This stage is not about memorizing a sentence; it is about proving that the learner understands the logic and can apply it responsibly.`,
      ],
      bullets: [
        "Explain the reasoning behind the final decision.",
        "Identify the most important trade-off or constraint.",
        "Consider what would change if the situation changed.",
      ],
      questions: [
        {
          id: `${slugify(title)}-reflection`,
          type: "short-answer",
          prompt: `Describe one practical lesson you learned from ${title} that you could apply in a real scenario.`,
          answer: "The lesson is to define the problem clearly, compare options with evidence, and choose the decision that best fits the constraints and goals.",
          explanation: "Reflection ensures learners can transfer academic understanding into practical judgment and action.",
        },
      ],
    },
    {
      id: "knowledge-check-and-completion",
      title: labels.completion,
      body: [
        `To complete this lesson, the learner must answer the required questions and show that they can explain the concept, apply it to a scenario, and use evidence to justify the result.`,
        `A passing result requires at least 80% across all required assessment items. This ensures the learner has acquired usable understanding and not only surface-level familiarity.`,
      ],
      questions: [
        {
          id: `${slugify(title)}-final-mcq`,
          type: "multiple-choice",
          prompt: `Which statement best describes successful completion of ${title}?`,
          options: [
            "Reading the heading and moving on without evidence",
            "Showing understanding through explanation, application, and assessment",
            "Skipping practice and only guessing answers",
          ],
          answer: 1,
          explanation: "Successful completion means being able to explain, apply, and defend the concept with evidence.",
        },
        {
          id: `${slugify(title)}-final-true`,
          type: "true-false",
          prompt: `${concept.keyQuestion}`,
          answer: true,
          explanation: "The question is designed to test whether the learner understands the real purpose and logic of the topic.",
        },
      ],
    },
  ];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildLessonBlueprint(
  course: Partial<{ id: string; title: string; summary: string; program: string; modules: string[]; learningObjectives: string[] }> = {},
  language = "en",
): LessonBlueprint {
  const title = course.title || "Academic Lesson";
  const summary =
    course.summary ||
    `Develop practical understanding of ${title.toLowerCase()} through structured academic analysis and applied exercises.`;

  const stages = title.toLowerCase().includes("household budget")
    ? buildHouseholdBudgetLesson(language)
    : buildGenericLesson(title, language);

  return {
    title,
    summary,
    stages,
    passingScore: 80,
  };
}
