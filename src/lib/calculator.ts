import type {
  Service,
  Region,
  Currency,
  PricingFactors,
  PriorityLevel,
  CalculationBreakdown,
} from '../types';

export const PRIORITY_MULTIPLIERS: Record<PriorityLevel, number> = {
  standard: 1.0,
  high: 1.3,
  urgent: 1.5,
};

export interface CalculationParams {
  service: Service;
  region: Region;
  currency: Currency;
  pricingFactors: PricingFactors;
  noa: number;
  vat: number;
  ntb: number;
  lac: number;
  priority: PriorityLevel;
}

export function calculatePrice(params: CalculationParams): CalculationBreakdown {
  const {
    service,
    region,
    currency,
    pricingFactors,
    noa,
    vat,
    ntb,
    lac,
    priority,
  } = params;

  const noaFactor = Math.pow(
    noa / pricingFactors.ref_noa,
    service.noa_sensitivity
  );

  const vatFactor = Math.pow(
    vat / pricingFactors.ref_vat,
    service.vat_sensitivity
  );

  const ntbFactor = Math.pow(
    ntb / pricingFactors.ref_ntb,
    service.ntb_sensitivity
  );

  const lacFactor =
    (lac / 100) *
    pricingFactors.lac_impact_multiplier *
    service.lac_sensitivity;

  const complexityFactor =
    noaFactor * pricingFactors.noa_weight +
    vatFactor * pricingFactors.vat_weight +
    ntbFactor * pricingFactors.ntb_weight +
    lacFactor * pricingFactors.lac_weight;

  let adjustedPrice: number;

  switch (service.pricing_type) {
    case 'fixed':
      adjustedPrice = service.base_price;
      break;
    case 'variable':
      adjustedPrice = service.base_price * complexityFactor;
      break;
    case 'hybrid':
      adjustedPrice =
        (service.hybrid_fixed_price || 0) +
        service.base_price * complexityFactor;
      break;
  }

  const priorityMultiplier = PRIORITY_MULTIPLIERS[priority];
  const regionalFactor = region.factor;
  const exchangeRate = currency.exchange_rate;

  const finalPrice =
    adjustedPrice * priorityMultiplier * regionalFactor * exchangeRate;

  return {
    noaFactor,
    vatFactor,
    ntbFactor,
    lacFactor,
    complexityFactor,
    basePrice: service.base_price,
    adjustedPrice,
    priorityMultiplier,
    regionalFactor,
    exchangeRate,
    finalPrice,
  };
}

export function formatCurrency(amount: number, currencySymbol: string): string {
  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function validateCalculatorInputs(inputs: {
  clientName: string;
  projectName: string;
  serviceId: number | null;
  noa: number;
  vat: number;
  ntb: number;
  lac: number;
  regionCode: string;
  currencyCode: string;
}): string[] {
  const errors: string[] = [];

  if (!inputs.clientName?.trim()) {
    errors.push('Client name is required');
  }

  if (!inputs.projectName?.trim()) {
    errors.push('Project name is required');
  }

  if (!inputs.serviceId) {
    errors.push('Please select a service');
  }

  if (inputs.noa < 1 || inputs.noa > 1000000) {
    errors.push('NOA must be between 1 and 1,000,000 m²');
  }

  if (inputs.vat < 1 || inputs.vat > 10000000) {
    errors.push('VAT must be between 1 and 10,000,000');
  }

  if (inputs.ntb < 1 || inputs.ntb > 500) {
    errors.push('Number of buildings must be between 1 and 500');
  }

  if (inputs.lac < 0 || inputs.lac > 100) {
    errors.push('LAC must be between 0% and 100%');
  }

  if (!inputs.regionCode) {
    errors.push('Please select a region');
  }

  if (!inputs.currencyCode) {
    errors.push('Please select a currency');
  }

  return errors;
}
