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
  static calculateItem(cpg: number, factor: number | null, globalFactor: number, dose: number, caps: number, unit: string = 'mg'): CalculationResult {
    let g = (dose / 1000) * caps;
    
    // Unit adjustment
    if (unit.toLowerCase() === 'mcg') {
      g = (dose / 1000000) * caps;
    } else if (unit.toLowerCase() === 'ui' || unit.toLowerCase() === 'iu') {
      // In this system, UI items usually have CPG adjusted to "Cost per 1000 UI"
      // or we assume a 1:1 milligram equivalence for simplified billing if cpg is high.
      // Keeping / 1000 for parity with data seed common patterns.
      g = (dose / 1000) * caps;
    }

    const raw = g * cpg;
    const f = factor ?? globalFactor;
    // Using simple rounding to parity with original logic
    const price = parseFloat((raw * f).toFixed(4));
    
    return { g, raw, price };
  }

  /**
   * Equivalent to fCalc in basic-system.html
   */
  static calculateOrder(items: { cpg: number; factor: number | null; dosePerCap: number; unit: string }[], caps: number, globalFactor: number, capCost: number): OrderTotalResult {
    let raw = 0;
    let priceByItems = 0;
    
    items.forEach(it => {
      const calc = this.calculateItem(it.cpg, it.factor, globalFactor, it.dosePerCap, caps, it.unit);
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
