export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  INR: '₹',
  SGD: 'S$',
  NZD: 'NZ$',
  ZAR: 'R',
  BRL: 'R$',
  MXN: '$',
  MYR: 'RM',
  IDR: 'Rp',
  THB: '฿',
  PHP: '₱',
  VND: '₫',
  KRW: '₩',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
};

export const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.50,
  AUD: 1.53,
  CAD: 1.35,
  CHF: 0.88,
  INR: 83.00,
  SGD: 1.34,
  NZD: 1.64,
  ZAR: 18.80,
  BRL: 4.95,
  MXN: 17.10,
  MYR: 4.78,
  IDR: 15600.00,
  THB: 35.80,
  PHP: 55.90,
  VND: 24600.00,
  KRW: 1330.00,
  SEK: 10.40,
  NOK: 10.60,
  DKK: 6.85,
  PLN: 3.98,
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const code = currencyCode?.toUpperCase() || 'USD';
  return currencySymbols[code] || code;
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  const sourceRate = exchangeRates[fromCurrency.toUpperCase()] || 1.0;
  const targetRate = exchangeRates[toCurrency.toUpperCase()] || 1.0;
  const amountInUsd = amount / sourceRate;
  return amountInUsd * targetRate;
};
