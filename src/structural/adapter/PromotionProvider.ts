export interface ExternalPromotion {
  code: string;
  description: string;
  percentOff?: number;
  flatOff?: number;
  categories?: string[];
}

export interface PromotionProvider {
  loadPromotions(): Promise<ExternalPromotion[]>;
}
