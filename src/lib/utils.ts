import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate days remaining for subscription
export function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

// Calculate match score between job and user preferences
export function calculateMatchScore(
  job: {
    salaryMin?: number | null;
    salaryMax?: number | null;
    location?: string | null;
    workType?: string | null;
    jobDescription?: string | null;
  },
  preferences: {
    salaryMin?: number | null;
    salaryIdeal?: number | null;
    workLocationPreference?: string | null;
    maxCommute?: number | null;
    nonNegotiables?: string[];
    responsibilitiesWant?: string[];
    responsibilitiesAvoid?: string[];
  },
  careerProfile: {
    technicalSkills?: string[];
    softSkills?: string[];
    toolsAndSoftware?: string[];
  },
  weights: Record<string, number>
): { score: number; breakdown: Record<string, boolean> } {
  const breakdown: Record<string, boolean> = {};
  let totalWeight = 0;
  let earnedWeight = 0;

  // Salary check
  if (weights.salary) {
    totalWeight += weights.salary;
    const jobSalary = job.salaryMin || job.salaryMax;
    const userMin = preferences.salaryMin;
    if (jobSalary && userMin && jobSalary >= userMin) {
      earnedWeight += weights.salary;
      breakdown.salary = true;
    } else if (!jobSalary) {
      // No salary info - give partial credit
      earnedWeight += weights.salary * 0.5;
      breakdown.salary = true;
    } else {
      breakdown.salary = false;
    }
  }

  // Work location check
  if (weights.workLocation) {
    totalWeight += weights.workLocation;
    const jobType = job.workType?.toLowerCase();
    const prefType = preferences.workLocationPreference?.toLowerCase();
    if (!prefType || prefType === "flexible" || jobType === prefType) {
      earnedWeight += weights.workLocation;
      breakdown.workLocation = true;
    } else if (prefType === "remote" && jobType === "hybrid") {
      // Partial credit for hybrid when remote preferred
      earnedWeight += weights.workLocation * 0.5;
      breakdown.workLocation = false;
    } else {
      breakdown.workLocation = false;
    }
  }

  // Skills check (from job description)
  if (weights.mustHaveSkills && job.jobDescription && careerProfile.technicalSkills) {
    totalWeight += weights.mustHaveSkills;
    const descLower = job.jobDescription.toLowerCase();
    const allSkills = [
      ...(careerProfile.technicalSkills || []),
      ...(careerProfile.toolsAndSoftware || []),
    ];
    const matchedSkills = allSkills.filter((skill) =>
      descLower.includes(skill.toLowerCase())
    );
    const matchRate = allSkills.length > 0 ? matchedSkills.length / allSkills.length : 0;
    earnedWeight += weights.mustHaveSkills * matchRate;
    breakdown.mustHaveSkills = matchRate >= 0.5;
  }

  // Nice to have skills
  if (weights.niceToHaveSkills && job.jobDescription && careerProfile.softSkills) {
    totalWeight += weights.niceToHaveSkills;
    const descLower = job.jobDescription.toLowerCase();
    const matchedSkills = careerProfile.softSkills.filter((skill) =>
      descLower.includes(skill.toLowerCase())
    );
    const matchRate = careerProfile.softSkills.length > 0 
      ? matchedSkills.length / careerProfile.softSkills.length 
      : 0;
    earnedWeight += weights.niceToHaveSkills * matchRate;
    breakdown.niceToHaveSkills = matchRate >= 0.3;
  }

  // Non-negotiables check (things to avoid)
  if (weights.nonNegotiables && job.jobDescription && preferences.nonNegotiables) {
    totalWeight += weights.nonNegotiables;
    const descLower = job.jobDescription.toLowerCase();
    const dealbreakers = preferences.nonNegotiables.filter((item) =>
      descLower.includes(item.toLowerCase())
    );
    if (dealbreakers.length === 0) {
      earnedWeight += weights.nonNegotiables;
      breakdown.nonNegotiables = true;
    } else {
      breakdown.nonNegotiables = false;
    }
  }

  // Responsibilities check
  if (weights.responsibilities && job.jobDescription && preferences.responsibilitiesWant) {
    totalWeight += weights.responsibilities;
    const descLower = job.jobDescription.toLowerCase();
    const wantedMatches = preferences.responsibilitiesWant.filter((item) =>
      descLower.includes(item.toLowerCase())
    );
    const matchRate = preferences.responsibilitiesWant.length > 0
      ? wantedMatches.length / preferences.responsibilitiesWant.length
      : 0;
    earnedWeight += weights.responsibilities * matchRate;
    breakdown.responsibilities = matchRate >= 0.3;
  }

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  return { score, breakdown };
}

// Check if all required fields for a day are complete
export function isDayComplete(dayNumber: number, userData: any): boolean {
  switch (dayNumber) {
    case 1:
      // Career Profile - check key fields
      return !!(
        userData.careerProfile?.technicalSkills?.length > 0 &&
        userData.careerProfile?.yearsOfExperience &&
        userData.careerProfile?.accomplishments?.length > 0
      );
    case 2:
      // Career Preferences - check key fields
      return !!(
        userData.careerPreferences?.targetJobTitles?.length > 0 &&
        userData.careerPreferences?.salaryMin &&
        userData.careerPreferences?.workLocationPreference &&
        userData.careerPreferences?.nonNegotiables?.length > 0
      );
    case 3:
      // Job Leads - need 10 jobs saved
      return (userData.jobLeads?.filter((j: any) => j.status === "SAVED")?.length || 0) >= 10;
    case 4:
      // Resume Profile
      return !!(
        userData.resumeProfile?.headline &&
        userData.resumeProfile?.summaryStatement &&
        userData.resumeProfile?.bulletOne
      );
    case 5:
      // LinkedIn - just mark complete (we can't verify externally)
      return userData.dayProgress?.find((d: any) => d.dayNumber === 5)?.status === "COMPLETED";
    case 6:
      // Networking Setup
      return !!(
        userData.networkingSetup?.schedulingLink &&
        userData.networkingSetup?.elevatorPitch
      );
    case 7:
      // Networking Outreach Prep
      return !!(
        userData.networkingSetup?.hiringTeamTemplate &&
        userData.networkingSetup?.coworkerTemplate &&
        userData.networkingSetup?.coffeeChatQuestions?.length >= 4
      );
    case 8:
      // Applied to 5 jobs
      return (userData.jobLeads?.filter((j: any) => j.status !== "SAVED")?.length || 0) >= 5;
    case 9:
      // Applied to 10 jobs
      return (userData.jobLeads?.filter((j: any) => j.status !== "SAVED")?.length || 0) >= 10;
    case 10:
      // 30 networking messages sent
      return (userData.networkingContacts?.filter((c: any) => c.messageSent)?.length || 0) >= 30;
    case 11:
      // 60 networking messages sent
      return (userData.networkingContacts?.filter((c: any) => c.messageSent)?.length || 0) >= 60;
    case 12:
      // STAR stories - all 10 complete
      return (userData.starStories?.filter((s: any) => s.isComplete)?.length || 0) >= 10;
    case 13:
      // Practice sessions - at least 10 evaluations
      return (userData.practiceSessions?.length || 0) >= 10;
    case 14:
      // Follow-up - just mark complete
      return userData.dayProgress?.find((d: any) => d.dayNumber === 14)?.status === "COMPLETED";
    default:
      return false;
  }
}
