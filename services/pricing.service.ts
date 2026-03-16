export interface CalculationResult {
  g: number;
  raw: number;
  price: number;
}

export interface OrderTotalResult {
  raw: number;
  price: number;
  capsTotal: number;
  total: number;
}

export class PricingService {
  /**
   * Equivalent to iCalc in basic-system.html
   */
  static calculateItem(cpg: number, factor: number | null, globalFactor: number, dose: number, caps: number): CalculationResult {
    const g = (dose / 1000) * caps;
    const raw = g * cpg;
    const f = factor ?? globalFactor;
    // Using simple rounding to parity with original logic
    const price = parseFloat((raw * f).toFixed(4));
    
    return { g, raw, price };
  }

  /**
   * Equivalent to fCalc in basic-system.html
   */
  static calculateOrder(items: { cpg: number; factor: number | null; dosePerCap: number }[], caps: number, globalFactor: number, capCost: number): OrderTotalResult {
    let raw = 0;
    let priceByItems = 0;
    
    items.forEach(it => {
      const calc = this.calculateItem(it.cpg, it.factor, globalFactor, it.dosePerCap, caps);
      raw += calc.raw;
      priceByItems += calc.price;
    });
    
    const capsTotal = parseFloat((caps * capCost).toFixed(2));
    const total = parseFloat((priceByItems + capsTotal).toFixed(2));
    
    return {
      raw,
      price: priceByItems,
      capsTotal,
      total
    };
  }
}
