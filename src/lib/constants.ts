// 14-Day Program Structure

export const DAYS = [
  {
    number: 1,
    title: "Know Yourself",
    description: "Build your professional identity by documenting your skills, experience, and accomplishments.",
    estimatedTime: "30 minutes",
    sections: [
      "Technical & Soft Skills",
      "Tools & Software",
      "Experience & Job History",
      "Education & Certifications",
      "Accomplishments & Wins",
    ],
  },
  {
    number: 2,
    title: "Know What You Want",
    description: "Define your ideal role, compensation, work environment, and non-negotiables.",
    estimatedTime: "30 minutes",
    sections: [
      "Target Roles & Industries",
      "Compensation Goals",
      "Work Environment",
      "Responsibilities (Want & Avoid)",
      "Non-Negotiables",
      "Priority Weights",
    ],
  },
  {
    number: 3,
    title: "Find 10 Target Jobs",
    description: "Search job boards and save 10 jobs that match your criteria. See how each one scores against your profile.",
    estimatedTime: "30 minutes",
    sections: [
      "Search for jobs on LinkedIn, Indeed, Glassdoor",
      "Save jobs that look interesting",
      "Review match scores",
      "Replace any that don't fit",
    ],
  },
  {
    number: 4,
    title: "Update Your Resume",
    description: "Polish your headline, summary, and transform your bullets using the proven formula.",
    estimatedTime: "30 minutes",
    sections: [
      "Contact Information",
      "Professional Headline",
      "Summary Statement",
      "Experience Bullets (Accomplished X by doing Y, resulting in Z)",
    ],
  },
  {
    number: 5,
    title: "LinkedIn Alignment",
    description: "Make sure your LinkedIn profile tells the same story as your resume.",
    estimatedTime: "30 minutes",
    sections: [
      "Update Headline",
      "Update About Section",
      "Update Experience Bullets",
      "Verify Titles & Dates Match",
      "Add Skills",
      "Customize URL",
    ],
  },
  {
    number: 6,
    title: "Networking Setup",
    description: "Prepare your calendar, scheduling link, and craft your elevator pitch.",
    estimatedTime: "30 minutes",
    sections: [
      "Identify Available Time Slots",
      "Set Up Scheduling Link (Calendly)",
      "Write Your Elevator Pitch",
    ],
  },
  {
    number: 7,
    title: "Networking Outreach Prep",
    description: "Create your message templates and prepare your coffee chat questions.",
    estimatedTime: "30 minutes",
    sections: [
      "Hiring Team Message Template",
      "Potential Coworker Message Template",
      "4 Coffee Chat Questions",
    ],
  },
  {
    number: 8,
    title: "Apply to 5 Jobs",
    description: "Verify your saved jobs are still open and submit your first 5 applications.",
    estimatedTime: "30 minutes",
    sections: [
      "Verify Jobs Are Open",
      "Customize Cover Letter",
      "Submit Applications",
      "Track in Dashboard",
    ],
  },
  {
    number: 9,
    title: "Apply to 5 More Jobs",
    description: "Complete your applications to reach 10 total.",
    estimatedTime: "30 minutes",
    sections: [
      "Apply to Remaining 5 Jobs",
      "Update Application Tracker",
    ],
  },
  {
    number: 10,
    title: "Send 30 Networking Messages",
    description: "Reach out to 6 people at each of your first 5 companies (3 hiring team + 3 potential coworkers).",
    estimatedTime: "30 minutes",
    sections: [
      "Find 6 Contacts at Each Company",
      "Send Personalized Messages",
      "Track Outreach Status",
    ],
  },
  {
    number: 11,
    title: "Send 30 More Networking Messages",
    description: "Complete your outreach to the remaining 5 companies.",
    estimatedTime: "30 minutes",
    sections: [
      "Find 6 Contacts at Each Company",
      "Send Personalized Messages",
      "Track Outreach Status",
    ],
  },
  {
    number: 12,
    title: "STAR Story Prep",
    description: "Write out answers to the 10 most common behavioral interview questions using the STAR method.",
    estimatedTime: "30 minutes",
    sections: [
      "10 Behavioral Questions",
      "STAR Framework (Situation, Task, Action, Result)",
    ],
  },
  {
    number: 13,
    title: "Practice on Camera",
    description: "Record yourself answering each question, evaluate your delivery, and get tips for improvement.",
    estimatedTime: "30 minutes",
    sections: [
      "Record Your Answers",
      "Self-Evaluate (Pacing, Eye Contact, Filler Words, Confidence)",
      "Note Areas for Improvement",
    ],
  },
  {
    number: 14,
    title: "Follow-Up Strategy",
    description: "Learn how to follow up on applications and networking messages, then continue your momentum.",
    estimatedTime: "30 minutes",
    sections: [
      "Job Application Follow-Up Timeline",
      "Networking Follow-Up Timeline",
      "Follow-Up Templates",
      "Next Steps",
    ],
  },
];

// 10 Common Behavioral Questions
export const STAR_QUESTIONS = [
  {
    number: 1,
    question: "Tell me about yourself",
    whatTheyreAsking: "Can you communicate clearly and are you a fit?",
  },
  {
    number: 2,
    question: "Tell me about a time you failed",
    whatTheyreAsking: "Do you take accountability and learn from mistakes?",
  },
  {
    number: 3,
    question: "Tell me about a conflict with a coworker",
    whatTheyreAsking: "Can you handle disagreements professionally?",
  },
  {
    number: 4,
    question: "Tell me about a time you showed leadership",
    whatTheyreAsking: "Can you step up without being asked?",
  },
  {
    number: 5,
    question: "Tell me about your biggest accomplishment",
    whatTheyreAsking: "What are you capable of at your best?",
  },
  {
    number: 6,
    question: "Tell me about a time you had to meet a tight deadline",
    whatTheyreAsking: "How do you handle pressure?",
  },
  {
    number: 7,
    question: "Tell me about a time you had to learn something new quickly",
    whatTheyreAsking: "Are you adaptable?",
  },
  {
    number: 8,
    question: "Tell me about a time you disagreed with your manager",
    whatTheyreAsking: "Can you push back respectfully?",
  },
  {
    number: 9,
    question: "Tell me about a time you went above and beyond",
    whatTheyreAsking: "Do you take initiative?",
  },
  {
    number: 10,
    question: "Why do you want to work here?",
    whatTheyreAsking: "Did you do your research? Are you genuinely interested?",
  },
];

// Pricing Tiers
export const PRICING_TIERS = {
  STARTER: {
    name: "Starter",
    price: 149,
    days: 16,
    hasAI: false,
    features: [
      "14-day guided program",
      "16 days to complete (buffer for life)",
      "Career profile dashboard",
      "Job tracker with match scores",
      "Networking contact tracker",
      "STAR story builder",
      "Read-only access after completion",
    ],
  },
  PRO: {
    name: "Pro",
    price: 299,
    days: 32,
    hasAI: true,
    features: [
      "Everything in Starter",
      "32 days to complete",
      "AI-powered resume bullet rewriting",
      "AI STAR story coaching",
      "AI networking message variations",
    ],
  },
  PREMIUM: {
    name: "Premium",
    price: 499,
    days: 365,
    hasAI: true,
    features: [
      "Everything in Pro",
      "365 days of access",
      "Salary negotiation scripts",
      "First 90 days guide",
      "Weekly wins tracker",
    ],
  },
};

// Reactivation Pricing (50% off)
export const REACTIVATION_PRICING = {
  STARTER: {
    originalPrice: 149,
    discountedPrice: 75,
    days: 16,
  },
  PRO: {
    originalPrice: 299,
    discountedPrice: 150,
    days: 32,
  },
};

// Job Status Options
export const JOB_STATUSES = [
  { value: "SAVED", label: "Saved", color: "gray" },
  { value: "APPLIED", label: "Applied", color: "blue" },
  { value: "SCREENING", label: "Screening", color: "yellow" },
  { value: "INTERVIEW", label: "Interview", color: "purple" },
  { value: "FINAL_ROUND", label: "Final Round", color: "indigo" },
  { value: "OFFER", label: "Offer", color: "green" },
  { value: "REJECTED", label: "Rejected", color: "red" },
  { value: "WITHDRAWN", label: "Withdrawn", color: "gray" },
];

// Networking Status Options
export const NETWORKING_STATUSES = [
  { value: "NOT_CONTACTED", label: "Not Contacted", color: "gray" },
  { value: "SENT", label: "Sent", color: "blue" },
  { value: "RESPONDED", label: "Responded", color: "yellow" },
  { value: "SCHEDULED", label: "☕ Scheduled", color: "purple" },
  { value: "COMPLETED", label: "☕ Completed", color: "green" },
  { value: "DECLINED", label: "Declined", color: "red" },
  { value: "NO_REPLY", label: "No Reply", color: "gray" },
  { value: "FOLLOW_UP_NEEDED", label: "Follow-up Needed", color: "orange" },
];

// Default Weights for Job Matching
export const DEFAULT_WEIGHTS = {
  salary: 20,
  workLocation: 15,
  commute: 10,
  mustHaveSkills: 25,
  niceToHaveSkills: 10,
  nonNegotiables: 15,
  responsibilities: 5,
};

// Coffee Chat Questions
export const COFFEE_CHAT_QUESTIONS = [
  "What have people who have been successful in this role done well?",
  "What have people in this role struggled with or gotten wrong?",
  "If you were in my position, what's one piece of advice you'd give yourself?",
  "Where else would you look for similar roles or opportunities?",
];
