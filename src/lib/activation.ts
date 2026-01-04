// Master activation codes per tier
// These look complex but are the same for all users in each tier

export const MASTER_CODES = {
  STARTER: process.env.ACTIVATION_CODE_STARTER || 'IA-S7F2A-8B3C1-D9E4F-2A7B8-C3D1',
  PRO: process.env.ACTIVATION_CODE_PRO || 'IA-P4E9B-7C2D5-F1A8E-3B6C9-D4F2',
  PREMIUM: process.env.ACTIVATION_CODE_PREMIUM || 'IA-M2C8D-5F1A9-E7B3C-8D4F2-A6E1',
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
      return 16;
    case 'PRO':
      return 32;
    case 'PREMIUM':
      return 365;
    default:
      return 16;
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
