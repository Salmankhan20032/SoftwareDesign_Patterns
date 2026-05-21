import { LegacyPromoAPI } from '../../external/LegacyPromoAPI';
import type { ExternalPromotion, PromotionProvider } from './PromotionProvider';

/**
 * Adapter — translates legacy promo records into our PromotionProvider contract.
 */
export class LegacyPromoAdapter implements PromotionProvider {
  private readonly api: LegacyPromoAPI;

  constructor(api?: LegacyPromoAPI) {
    this.api = api ?? new LegacyPromoAPI();
  }

  async loadPromotions(): Promise<ExternalPromotion[]> {
    const records = await this.api.fetchActivePromos();
    return records.map((record) => ({
      code: record.promo_cd.trim().toUpperCase(),
      description: record.desc_txt,
      percentOff: record.disc_pct ?? undefined,
      flatOff: record.flat_amt ?? undefined,
      categories: record.eligible_cats ?? undefined,
    }));
  }
}
