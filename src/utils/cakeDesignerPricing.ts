/**
 * Modular pricing calculator for Custom Cake Designer
 */
import { CustomCakeDesign, CakeDesignPrice, PriceBreakdownItem } from '../types/cakeDesigner';
import { getCakeDesignerConfig } from '../config/cakeDesignerConfig';

export function calculateCustomCakePrice(
  design: CustomCakeDesign,
  configOverride?: ReturnType<typeof getCakeDesignerConfig>
): CakeDesignPrice {
  const cfg = configOverride || getCakeDesignerConfig();
  const breakdown: PriceBreakdownItem[] = [];

  // 1. Base price for selected size
  const basePrice = cfg.basePricesBySize[design.size] || 900;
  breakdown.push({
    label: `Base Sponge & Assembly (${design.size})`,
    amount: basePrice
  });

  let customizationCharges = 0;

  // 2. Shape surcharge
  const shapeFee = cfg.shapeSurcharges[design.shape] || 0;
  if (shapeFee > 0) {
    customizationCharges += shapeFee;
    breakdown.push({
      label: `Special Mold Shape (${design.shape})`,
      amount: shapeFee
    });
  }

  // 3. Sponge flavour surcharge
  const spongeFee = cfg.spongeSurcharges[design.sponge] || 0;
  if (spongeFee > 0) {
    customizationCharges += spongeFee;
    breakdown.push({
      label: `Premium Sponge Flavour (${design.sponge})`,
      amount: spongeFee
    });
  }

  // 4. Filling surcharge
  const fillingFee = cfg.fillingSurcharges[design.filling] || 0;
  if (fillingFee > 0) {
    customizationCharges += fillingFee;
    breakdown.push({
      label: `Gourmet Filling Layer (${design.filling})`,
      amount: fillingFee
    });
  }

  // 5. Decorations
  if (design.decorations && design.decorations.length > 0) {
    design.decorations.forEach((decId) => {
      const decOpt = cfg.decorations.find((d) => d.id === decId);
      if (decOpt) {
        customizationCharges += decOpt.price;
        breakdown.push({
          label: decOpt.name,
          amount: decOpt.price
        });
      }
    });
  }

  const totalPrice = basePrice + customizationCharges;

  return {
    basePrice,
    customizationCharges,
    totalPrice,
    breakdown
  };
}
