import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// Improve a resume bullet using the XYZ formula
export async function improveResumeBullet(
  originalBullet: string,
  context: {
    jobTitle?: string;
    industry?: string;
    skills?: string[];
  }
): Promise<string> {
  const prompt = `You are an expert resume writer. Improve this resume bullet using the proven formula: "Accomplished [X] by doing [Y], resulting in [Z]"

Original bullet: "${originalBullet}"

${context.jobTitle ? `Job title: ${context.jobTitle}` : ""}
${context.industry ? `Industry: ${context.industry}` : ""}
${context.skills?.length ? `Key skills: ${context.skills.join(", ")}` : ""}

Rules:
1. Start with a strong action verb
2. Include specific metrics/numbers where possible
3. Show the impact/result
4. Keep it under 2 sentences
5. Make it ATS-friendly

Return ONLY the improved bullet, nothing else.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || originalBullet;
}

// Coach a STAR story response
export async function coachStarStory(
  story: {
    question: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  }
): Promise<{
  feedback: string;
  improvedVersion: string;
  tips: string[];
}> {
  const prompt = `You are an expert interview coach. Review this STAR story and provide coaching.

Question: "${story.question}"

Current Answer:
- Situation: ${story.situation}
- Task: ${story.task}
- Action: ${story.action}
- Result: ${story.result}

Provide:
1. Brief feedback on what's good and what needs work (2-3 sentences)
2. An improved version that combines all parts into a natural 1-2 minute response
3. 3 specific tips to make it stronger

Format your response as JSON:
{
  "feedback": "...",
  "improvedVersion": "...",
  "tips": ["tip1", "tip2", "tip3"]
}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.7,
  });

  try {
    const content = response.choices[0]?.message?.content || "";
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
  }

  return {
    feedback: "Unable to generate feedback. Please try again.",
    improvedVersion: "",
    tips: [],
  };
}

// Generate networking message variations
export async function generateMessageVariations(
  template: string,
  context: {
    recipientName: string;
    recipientRole: string;
    company: string;
    yourName: string;
    yourTitle: string;
    specificDetail?: string;
  }
): Promise<string[]> {
  const prompt = `You are an expert at professional networking. Generate 3 variations of this networking message template, personalized for the recipient.

Template:
${template}

Context:
- Recipient: ${context.recipientName}, ${context.recipientRole} at ${context.company}
- Sender: ${context.yourName}, ${context.yourTitle}
${context.specificDetail ? `- Specific detail to mention: ${context.specificDetail}` : ""}

Rules:
1. Keep each message professional but warm
2. Make each variation distinct in tone (formal, friendly, concise)
3. Replace all [bracketed placeholders] with actual content
4. Keep messages under 150 words each

Return the 3 variations as a JSON array:
["variation1", "variation2", "variation3"]`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.8,
  });

  try {
    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
  }

  return [];
}

// Generate salary negotiation script
export async function generateSalaryScript(
  context: {
    targetSalary: number;
    currentOffer: number;
    role: string;
    yearsExperience: number;
    keyAccomplishments: string[];
    marketData?: string;
  }
): Promise<{
  openingStatement: string;
  counterOfferScript: string;
  negotiationTips: string[];
  walkAwayGuidance: string;
}> {
  const prompt = `You are an expert salary negotiation coach. Create a personalized negotiation script.

Context:
- Role: ${context.role}
- Current offer: $${context.currentOffer.toLocaleString()}
- Target salary: $${context.targetSalary.toLocaleString()}
- Years of experience: ${context.yearsExperience}
- Key accomplishments: ${context.keyAccomplishments.join("; ")}
${context.marketData ? `- Market data: ${context.marketData}` : ""}

Provide:
1. Opening statement (express enthusiasm, then pivot to negotiation)
2. Counter-offer script (specific words to use)
3. 4 negotiation tips specific to this situation
4. Walk-away guidance (when to accept, when to decline)

Format as JSON:
{
  "openingStatement": "...",
  "counterOfferScript": "...",
  "negotiationTips": ["tip1", "tip2", "tip3", "tip4"],
  "walkAwayGuidance": "..."
}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.7,
  });

  try {
    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
  }

  return {
    openingStatement: "",
    counterOfferScript: "",
    negotiationTips: [],
    walkAwayGuidance: "",
  };
}

// Generate first 90 days plan
export async function generateFirst90DaysPlan(
  context: {
    role: string;
    company: string;
    industry: string;
    teamSize?: number;
    reportingTo?: string;
    keyResponsibilities: string[];
  }
): Promise<{
  days1to30: { focus: string; goals: string[]; actions: string[] };
  days31to60: { focus: string; goals: string[]; actions: string[] };
  days61to90: { focus: string; goals: string[]; actions: string[] };
  quickWins: string[];
  relationshipsTouild: string[];
}> {
  const prompt = `You are an expert career coach. Create a first 90 days plan for someone starting a new role.

Context:
- Role: ${context.role}
- Company: ${context.company}
- Industry: ${context.industry}
${context.teamSize ? `- Team size: ${context.teamSize}` : ""}
${context.reportingTo ? `- Reports to: ${context.reportingTo}` : ""}
- Key responsibilities: ${context.keyResponsibilities.join("; ")}

Create a detailed 90-day plan with:
1. Days 1-30: Learning & listening phase
2. Days 31-60: Contributing & building relationships
3. Days 61-90: Driving impact & establishing presence

Format as JSON:
{
  "days1to30": { "focus": "...", "goals": ["..."], "actions": ["..."] },
  "days31to60": { "focus": "...", "goals": ["..."], "actions": ["..."] },
  "days61to90": { "focus": "...", "goals": ["..."], "actions": ["..."] },
  "quickWins": ["..."],
  "relationshipsToBuild": ["..."]
}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1200,
    temperature: 0.7,
  });

  try {
    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
  }

  return {
    days1to30: { focus: "", goals: [], actions: [] },
    days31to60: { focus: "", goals: [], actions: [] },
    days61to90: { focus: "", goals: [], actions: [] },
    quickWins: [],
    relationshipsTouild: [],
  };
}
