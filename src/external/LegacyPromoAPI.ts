/**
 * Simulated third-party API — incompatible shape with our domain.
 * (Intentionally awkward field names for Adapter demo.)
 */
export type LegacyPromoRecord = {
  promo_cd: string;
  desc_txt: string;
  disc_pct: number | null;
  flat_amt: number | null;
  eligible_cats: string[] | null;
};

export class LegacyPromoAPI {
  async fetchActivePromos(): Promise<LegacyPromoRecord[]> {
    await delay(120);
    return [
      {
        promo_cd: 'PARTNER-TECH',
        desc_txt: 'Partner tech weekend',
        disc_pct: 8,
        flat_amt: null,
        eligible_cats: ['electronics'],
      },
      {
        promo_cd: 'PARTNER-FLAT',
        desc_txt: 'Partner flat welcome',
        disc_pct: null,
        flat_amt: 12,
        eligible_cats: null,
      },
    ];
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
