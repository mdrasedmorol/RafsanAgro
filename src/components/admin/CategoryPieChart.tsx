'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getExpenseByCategory } from '@/lib/demo-data';
import { EXPENSE_CATEGORIES } from '@/lib/utils';
import type { DemoTransaction } from '@/lib/demo-data';

interface CategoryPieChartProps {
  transactions: DemoTransaction[];
  height?: number;
}

const COLORS = ['#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', '#10b981', '#ec4899', '#6366f1', '#64748b'];

export default function CategoryPieChart({ transactions, height = 280 }: CategoryPieChartProps) {
  const data = getExpenseByCategory(transactions);

  const chartData = data.map((item) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.id === item.name);
    const displayName = cat ? `${cat.label_en} - ${cat.label_bn}` : item.name;
    return {
      name: displayName,
      value: item.value,
      color: cat?.color || '#64748b',
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
          wrapperStyle={{ fontSize: '11.5px', paddingTop: '4px' }}
          iconType="circle"
          iconSize={7}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

