import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
  calculatePrice,
  formatCurrency,
  validateCalculatorInputs,
  PRIORITY_MULTIPLIERS,
} from '../lib/calculator';
import type {
  Service,
  Region,
  Currency,
  PricingFactors,
  PriorityLevel,
  CalculatorInputs,
  CalculationBreakdown,
} from '../types';
import { Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export function Calculator() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [pricingFactors, setPricingFactors] = useState<PricingFactors | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [inputs, setInputs] = useState<CalculatorInputs>({
    clientName: '',
    projectName: '',
    serviceId: null,
    noa: 10000,
    vat: 50000,
    ntb: 5,
    lac: 50,
    regionCode: 'AP',
    currencyCode: 'USD',
    priority: 'standard',
  });

  const [calculation, setCalculation] = useState<CalculationBreakdown | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (
      inputs.serviceId &&
      inputs.regionCode &&
      inputs.currencyCode &&
      pricingFactors
    ) {
      performCalculation();
    }
  }, [inputs, pricingFactors]);

  const loadData = async () => {
    try {
      const [servicesData, regionsData, currenciesData, factorsData] =
        await Promise.all([
          api.services.getActive(),
          api.regions.getActive(),
          api.currencies.getActive(),
          api.pricingFactors.get(),
        ]);

      setServices(servicesData);
      setRegions(regionsData);
      setCurrencies(currenciesData);
      setPricingFactors(factorsData);

      if (servicesData.length > 0 && !inputs.serviceId) {
        setInputs((prev) => ({ ...prev, serviceId: servicesData[0].id }));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      showMessage('error', 'Failed to load calculator data');
    } finally {
      setLoading(false);
    }
  };

  const performCalculation = () => {
    if (!inputs.serviceId || !pricingFactors) return;

    const service = services.find((s) => s.id === inputs.serviceId);
    const region = regions.find((r) => r.code === inputs.regionCode);
    const currency = currencies.find((c) => c.code === inputs.currencyCode);

    if (!service || !region || !currency) return;

    const result = calculatePrice({
      service,
      region,
      currency,
      pricingFactors,
      noa: inputs.noa,
      vat: inputs.vat,
      ntb: inputs.ntb,
      lac: inputs.lac,
      priority: inputs.priority,
    });

    setCalculation(result);
  };

  const handleSaveQuote = async () => {
    const errors = validateCalculatorInputs(inputs);
    if (errors.length > 0) {
      showMessage('error', errors[0]);
      return;
    }

    if (!user) {
      showMessage('error', 'Please login to save quotes');
      return;
    }

    if (!calculation || !inputs.serviceId) return;

    setSaving(true);
    try {
      await api.quotes.create({
        client_name: inputs.clientName,
        project_name: inputs.projectName,
        service_id: inputs.serviceId,
        region: inputs.regionCode,
        currency: inputs.currencyCode,
        noa: inputs.noa,
        vat: inputs.vat,
        ntb: inputs.ntb,
        lac: inputs.lac,
        priority: inputs.priority,
        base_price: calculation.basePrice,
        adjusted_price: calculation.adjustedPrice,
        final_price: calculation.finalPrice,
        created_by: user.id,
      });

      showMessage('success', 'Quote saved successfully!');
    } catch (error) {
      console.error('Failed to save quote:', error);
      showMessage('error', 'Failed to save quote');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setInputs({
      clientName: '',
      projectName: '',
      serviceId: services[0]?.id || null,
      noa: 10000,
      vat: 50000,
      ntb: 5,
      lac: 50,
      regionCode: 'AP',
      currencyCode: 'USD',
      priority: 'standard',
    });
    setCalculation(null);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const selectedService = services.find((s) => s.id === inputs.serviceId);
  const selectedCurrency = currencies.find((c) => c.code === inputs.currencyCode);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Project Pricing Calculator
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Project Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={inputs.clientName}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, clientName: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={inputs.projectName}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, projectName: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service *
                </label>
                <select
                  value={inputs.serviceId || ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      serviceId: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {selectedService && (
                  <div className="mt-2 space-y-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        selectedService.pricing_type === 'fixed'
                          ? 'bg-green-100 text-green-800'
                          : selectedService.pricing_type === 'variable'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {selectedService.pricing_type.toUpperCase()}
                    </span>
                    {selectedService.description && (
                      <p className="text-sm text-gray-600">
                        {selectedService.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NOA - Net Operating Area (m²) *
                </label>
                <input
                  type="number"
                  value={inputs.noa}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, noa: Number(e.target.value) }))
                  }
                  min="1"
                  max="1000000"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Total net operating area in square meters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT - Value After Tax *
                </label>
                <input
                  type="number"
                  value={inputs.vat}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, vat: Number(e.target.value) }))
                  }
                  min="1"
                  max="10000000"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Project value after tax
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NTB - Number of Buildings *
                </label>
                <input
                  type="number"
                  value={inputs.ntb}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, ntb: Number(e.target.value) }))
                  }
                  min="1"
                  max="500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Total number of buildings in project
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LAC - Level of Architectural Complexity: {inputs.lac}%
                </label>
                <input
                  type="range"
                  value={inputs.lac}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, lac: Number(e.target.value) }))
                  }
                  min="0"
                  max="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Complexity of architectural design
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <select
                  value={inputs.regionCode}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, regionCode: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {regions.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name} ({region.code}) - Factor: {region.factor}x
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={inputs.currencyCode}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, currencyCode: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol}) - Rate: {currency.exchange_rate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priority Level *
                </label>
                <div className="space-y-2">
                  {(
                    Object.entries(PRIORITY_MULTIPLIERS) as [PriorityLevel, number][]
                  ).map(([priority, multiplier]) => (
                    <label
                      key={priority}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={priority}
                        checked={inputs.priority === priority}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            priority: e.target.value as PriorityLevel,
                          }))
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {priority} ({multiplier}x)
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                {user && (
                  <button
                    onClick={handleSaveQuote}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Quote
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Pricing Summary
            </h2>

            {calculation && selectedCurrency ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    FINAL PRICE
                  </div>
                  <div className="text-4xl font-bold text-blue-900">
                    {formatCurrency(calculation.finalPrice, selectedCurrency.symbol)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Base Price</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(calculation.basePrice, selectedCurrency.symbol)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Complexity Factor</span>
                    <span className="text-sm font-medium text-gray-900">
                      {calculation.complexityFactor.toFixed(2)}x
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Adjusted Price</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(calculation.adjustedPrice, selectedCurrency.symbol)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Priority Multiplier</span>
                    <span className="text-sm font-medium text-gray-900">
                      {calculation.priorityMultiplier.toFixed(1)}x
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Regional Factor</span>
                    <span className="text-sm font-medium text-gray-900">
                      {calculation.regionalFactor.toFixed(2)}x
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Exchange Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {calculation.exchangeRate.toFixed(4)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-sm font-medium text-gray-700">
                    View Calculation Breakdown
                  </span>
                  {showBreakdown ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {showBreakdown && pricingFactors && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Factor Contributions
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          NOA Factor (Weight: {(pricingFactors.noa_weight * 100).toFixed(0)}%)
                        </span>
                        <span className="font-medium text-gray-900">
                          {calculation.noaFactor.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          VAT Factor (Weight: {(pricingFactors.vat_weight * 100).toFixed(0)}%)
                        </span>
                        <span className="font-medium text-gray-900">
                          {calculation.vatFactor.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          NTB Factor (Weight: {(pricingFactors.ntb_weight * 100).toFixed(0)}%)
                        </span>
                        <span className="font-medium text-gray-900">
                          {calculation.ntbFactor.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          LAC Factor (Weight: {(pricingFactors.lac_weight * 100).toFixed(0)}%)
                        </span>
                        <span className="font-medium text-gray-900">
                          {calculation.lacFactor.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>Fill in all required fields to see pricing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
