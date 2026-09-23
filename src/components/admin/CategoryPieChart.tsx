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

export default function CategoryPieChart({ transactions, height = 300 }: CategoryPieChartProps) {
  const data = getExpenseByCategory(transactions);

  const chartData = data.map((item) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.id === item.name);
    return {
      name: cat?.label_en || item.name,
      value: item.value,
      color: cat?.color || '#64748b',
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '13px',
          }}
          formatter={(value: number) => [`৳${value.toLocaleString()}`, '']}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
