// Master activation codes per tier
// These look complex but are the same for all users in each tier

export const MASTER_CODES = {
  STARTER: process.env.ACTIVATION_CODE_STARTER || 'IA-STR-7X9K2-M4NP8-QW3R5-2024',
  PRO: process.env.ACTIVATION_CODE_PRO || 'IA-PRO-8H4J6-L2KM9-YT5V7-2024',
  PREMIUM: process.env.ACTIVATION_CODE_PREMIUM || 'IA-PRM-3F7B9-N8XC4-ZQ6W2-2024',
};

export type SubscriptionTier = 'STARTER' | 'PRO' | 'PREMIUM';

export function validateActivationCode(code: string): SubscriptionTier | null {
  const normalizedCode = code.trim().toUpperCase();

  if (normalizedCode === MASTER_CODES.STARTER.toUpperCase()) {
    return 'STARTER';
  }

  if (normalizedCode === MASTER_CODES.PRO.toUpperCase()) {
    return 'PRO';
  }

  if (normalizedCode === MASTER_CODES.PREMIUM.toUpperCase()) {
    return 'PREMIUM';
  }

  return null;
}

export function getTierDays(tier: SubscriptionTier): number {
  switch (tier) {
    case 'STARTER':
      return 14;
    case 'PRO':
      return 30;
    case 'PREMIUM':
      return 365;
    default:
      return 14;
  }
}

export function getTierName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'STARTER':
      return 'Starter';
    case 'PRO':
      return 'Pro';
    case 'PREMIUM':
      return 'Premium';
    default:
      return 'Starter';
  }
}

export function tierHasAI(tier: SubscriptionTier): boolean {
  return tier === 'PRO' || tier === 'PREMIUM';
}
