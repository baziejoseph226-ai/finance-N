import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CurrencyCode } from '../../types';

export type TimeRange = '7d' | '30d' | '3m' | '6m' | '1y';

interface NetWorthChartProps {
  currentValue: number;
  currency?: CurrencyCode;
}

export const NetWorthChart: React.FC<NetWorthChartProps> = ({ currentValue, currency = 'EUR' }) => {
  const [range, setRange] = useState<TimeRange>('6m');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Data sets depending on range
  const dataMap: Record<TimeRange, { date: string; value: number }[]> = {
    '7d': [
      { date: '08 Oct', value: currentValue * 0.985 },
      { date: '09 Oct', value: currentValue * 0.988 },
      { date: '10 Oct', value: currentValue * 0.982 },
      { date: '11 Oct', value: currentValue * 0.991 },
      { date: '12 Oct', value: currentValue * 0.995 },
      { date: '13 Oct', value: currentValue * 0.998 },
      { date: '14 Oct', value: currentValue },
    ],
    '30d': [
      { date: '15 Sep', value: currentValue * 0.942 },
      { date: '22 Sep', value: currentValue * 0.958 },
      { date: '29 Sep', value: currentValue * 0.965 },
      { date: '06 Oct', value: currentValue * 0.982 },
      { date: '14 Oct', value: currentValue },
    ],
    '3m': [
      { date: 'Juil', value: currentValue * 0.912 },
      { date: 'Août', value: currentValue * 0.938 },
      { date: 'Sept', value: currentValue * 0.965 },
      { date: 'Oct', value: currentValue },
    ],
    '6m': [
      { date: 'Mai', value: currentValue * 0.865 },
      { date: 'Juin', value: currentValue * 0.884 },
      { date: 'Juil', value: currentValue * 0.912 },
      { date: 'Août', value: currentValue * 0.938 },
      { date: 'Sept', value: currentValue * 0.965 },
      { date: 'Oct', value: currentValue },
    ],
    '1y': [
      { date: 'Nov 25', value: currentValue * 0.76 },
      { date: 'Jan 26', value: currentValue * 0.80 },
      { date: 'Mar 26', value: currentValue * 0.83 },
      { date: 'Mai 26', value: currentValue * 0.865 },
      { date: 'Juil 26', value: currentValue * 0.912 },
      { date: 'Sept 26', value: currentValue * 0.965 },
      { date: 'Oct 26', value: currentValue },
    ],
  };

  const points = dataMap[range];
  const values = points.map(p => p.value);
  const minVal = Math.min(...values) * 0.98;
  const maxVal = Math.max(...values) * 1.02;
  const rangeDiff = maxVal - minVal || 1;

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 25;

  const coordinates = points.map((p, i) => {
    const x = paddingX + (i / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p.value - minVal) / rangeDiff) * (height - paddingY * 2);
    return { x, y, ...p };
  });

  // Build SVG path
  const pathD = coordinates.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${height - paddingY} L ${coordinates[0].x} ${height - paddingY} Z`;

  const activePoint = hoverIndex !== null ? coordinates[hoverIndex] : coordinates[coordinates.length - 1];
  const growthPercent = ((currentValue - points[0].value) / points[0].value) * 100;

  return (
    <div className="w-full">
      {/* Range controls & dynamic metric */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {formatCurrency(activePoint.value, currency)}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>Date : <strong className="text-slate-200">{activePoint.date}</strong></span>
            <span className={`font-semibold ${growthPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercent(growthPercent)} sur la période
            </span>
          </div>
        </div>

        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {(['7d', '30d', '3m', '6m', '1y'] as TimeRange[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRange(r);
                setHoverIndex(null);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                range === r
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === '7d' && '7j'}
              {r === '30d' && '30j'}
              {r === '3m' && '3 mois'}
              {r === '6m' && '6 mois'}
              {r === '1y' && '1 an'}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(ratio => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
            );
          })}

          {/* Fill Area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Curved Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chartLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Points */}
          {coordinates.map((pt, i) => {
            const isHovered = hoverIndex === i;
            return (
              <g key={i} className="cursor-pointer">
                {/* Invisible hover area */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
                {/* Visual dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#0B1220"
                  stroke="#10B981"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150 pointer-events-none"
                />
                {/* Date label */}
                <text
                  x={pt.x}
                  y={height - 6}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {pt.date}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

interface IncomeExpenseBarChartProps {
  income: number;
  expenses: number;
  currency?: CurrencyCode;
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
  income,
  expenses,
  currency = 'EUR',
}) => {
  const max = Math.max(income, expenses, 1);
  const incomePercent = Math.min(100, Math.round((income / max) * 100));
  const expensePercent = Math.min(100, Math.round((expenses / max) * 100));

  return (
    <div className="space-y-4">
      {/* Income Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Revenus perçus
          </span>
          <span className="text-emerald-400 font-mono font-bold">
            {formatCurrency(income, currency)}
          </span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${incomePercent}%` }}
          />
        </div>
      </div>

      {/* Expenses Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            Dépenses engagées
          </span>
          <span className="text-rose-400 font-mono font-bold">
            {formatCurrency(expenses, currency)}
          </span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-500"
            style={{ width: `${expensePercent}%` }}
          />
        </div>
      </div>

      {/* Net savings indicator */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">Solde mensuel net :</span>
        <span className={`font-mono font-bold ${income >= expenses ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(income - expenses, currency, true)}
        </span>
      </div>
    </div>
  );
};

interface CategoryDonutChartProps {
  categories: { label: string; amount: number; color: string }[];
  currency?: CurrencyCode;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categories,
  currency = 'EUR',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = categories.reduce((sum, c) => sum + c.amount, 0) || 1;

  // Compute angles for donut SVG
  let cumulativeAngle = 0;
  const segments = categories.map((cat, idx) => {
    const angle = (cat.amount / total) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      ...cat,
      percentage: Math.round((cat.amount / total) * 100),
      startAngle,
      angle,
      index: idx,
    };
  });

  const activeSegment = hoveredIndex !== null ? segments[hoveredIndex] : segments[0];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-44 h-44 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
          {segments.map((seg, i) => {
            const isHovered = hoveredIndex === i;
            const r = isHovered ? 38 : 36;
            const strokeWidth = isHovered ? 13 : 11;
            const circumference = 2 * Math.PI * r;
            const strokeDasharray = `${(seg.angle / 360) * circumference} ${circumference}`;
            const strokeDashoffset = -((seg.startAngle / 360) * circumference);

            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            {activeSegment ? activeSegment.label : 'Total'}
          </span>
          <span className="text-sm font-bold text-white font-mono">
            {activeSegment ? formatCurrency(activeSegment.amount, currency) : formatCurrency(total, currency)}
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">
            {activeSegment ? `${activeSegment.percentage}%` : '100%'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2 max-h-48 overflow-y-auto pr-1">
        {segments.map((seg, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              hoveredIndex === i ? 'bg-slate-800' : 'hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-slate-300 font-medium truncate max-w-[120px]">{seg.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{seg.percentage}%</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(seg.amount, currency)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
