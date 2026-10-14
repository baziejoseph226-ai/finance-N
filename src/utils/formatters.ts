import { CurrencyCode } from '../types';

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'EUR',
  showSign: boolean = false
): string {
  const symbolMap: Record<CurrencyCode, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF',
    CAD: 'CA$',
  };

  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const symbol = symbolMap[currency] || '€';
  const sign = showSign && amount > 0 ? '+' : amount < 0 ? '-' : '';

  if (currency === 'EUR' || currency === 'CHF') {
    return `${sign}${formatted} ${symbol}`.trim();
  }
  return `${sign}${symbol}${formatted}`.trim();
}

export function formatPercent(value: number, showSign: boolean = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2).replace('.', ',')}%`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateEstimatedMonthsLeft(
  current: number,
  target: number,
  monthlyContribution: number
): { months: number; text: string } {
  const remaining = Math.max(0, target - current);
  if (remaining <= 0) {
    return { months: 0, text: 'Objectif atteint !' };
  }
  if (!monthlyContribution || monthlyContribution <= 0) {
    return { months: 999, text: 'Contribution non définie' };
  }

  const months = Math.ceil(remaining / monthlyContribution);
  if (months === 1) return { months: 1, text: '1 mois restant' };
  if (months < 12) return { months, text: `${months} mois restants` };

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) {
    return { months, text: `${years} an${years > 1 ? 's' : ''}` };
  }
  return { months, text: `${years} an${years > 1 ? 's' : ''} et ${remMonths} mois` };
}
