'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RevenueChartProps {
  data: { month: string; income: number; expense: number; profit: number }[];
  height?: number;
}

export default function RevenueChart({ data, height = 280 }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            fontSize: '12px',
            padding: '8px 12px',
          }}
          formatter={(value: number) => [`৳${value.toLocaleString()}`, '']}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#059669"
          strokeWidth={2}
          fill="url(#incomeGrad)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          name="Expense"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#expenseGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

