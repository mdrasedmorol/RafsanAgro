import { NextResponse } from 'next/server';
import { demoTransactions, getFinanceSummary, getMonthlyData, getExpenseByCategory } from '@/lib/demo-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');

  let filtered = [...demoTransactions];

  if (type && type !== 'ALL') {
    filtered = filtered.filter(t => t.type === type);
  }

  if (category && category !== 'ALL') {
    filtered = filtered.filter(t => t.category === category);
  }

  const summary = getFinanceSummary(filtered);
  const monthly = getMonthlyData(demoTransactions);
  const categoryBreakdown = getExpenseByCategory(demoTransactions);

  return NextResponse.json({
    success: true,
    summary,
    monthlyData: monthly,
    categoryBreakdown,
    count: filtered.length,
    data: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.type || !body.amount || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Type, amount, and category are required fields' },
        { status: 400 }
      );
    }

    const newTxn = {
      id: `txn-${Date.now()}`,
      type: body.type,
      category: body.category,
      amount: Number(body.amount),
      description: body.description || '',
      reference: body.reference || undefined,
      date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: 'Financial transaction recorded', data: newTxn },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to record transaction' },
      { status: 400 }
    );
  }
}
