import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { demoTransactions, getFinanceSummary, getMonthlyData, getExpenseByCategory } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let transactions: any[] = [];

    // Try fetching from Prisma Database
    try {
      const whereClause: any = {};
      if (type && type !== 'ALL') whereClause.type = type;
      if (category && category !== 'ALL') whereClause.category = category;
      if (search) {
        whereClause.OR = [
          { description: { contains: search, mode: 'insensitive' } },
          { reference: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ];
      }

      transactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
      });
    } catch (dbError) {
      console.warn('Prisma DB fetch failed, trying Supabase Client:', dbError);
      
      // Fallback to Supabase JS Client
      let query = supabaseAdmin.from('Transaction').select('*').order('date', { ascending: false });
      if (type && type !== 'ALL') query = query.eq('type', type);
      if (category && category !== 'ALL') query = query.eq('category', category);
      
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        transactions = data;
      }
    }

    // If database has records, compute metrics from DB data
    if (transactions && transactions.length > 0) {
      const formatted = transactions.map(t => ({
        id: t.id,
        type: t.type,
        category: t.category,
        amount: Number(t.amount),
        description: t.description || '',
        reference: t.reference || '',
        date: typeof t.date === 'string' ? t.date : new Date(t.date).toISOString(),
      }));

      const summary = getFinanceSummary(formatted);
      const monthlyData = getMonthlyData(formatted);
      const categoryBreakdown = getExpenseByCategory(formatted);

      return NextResponse.json({
        success: true,
        source: 'database',
        count: formatted.length,
        summary,
        monthlyData,
        categoryBreakdown,
        data: formatted,
      });
    }

    // Fallback to demo data if DB is empty or unpopulated
    let filtered = [...demoTransactions];
    if (type && type !== 'ALL') filtered = filtered.filter(t => t.type === type);
    if (category && category !== 'ALL') filtered = filtered.filter(t => t.category === category);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(q) ||
        t.reference?.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      source: 'demo_fallback',
      count: filtered.length,
      summary: getFinanceSummary(filtered),
      monthlyData: getMonthlyData(demoTransactions),
      categoryBreakdown: getExpenseByCategory(demoTransactions),
      data: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, category, description, reference, date } = body;

    if (!type || !amount || !category) {
      return NextResponse.json(
        { success: false, error: 'Type, amount, and category are required fields' },
        { status: 400 }
      );
    }

    const txDate = date ? new Date(date) : new Date();
    const txAmount = parseFloat(amount);

    let createdRecord = null;

    // 1. Try creating via Prisma
    try {
      createdRecord = await prisma.transaction.create({
        data: {
          type: type as 'INCOME' | 'EXPENSE',
          category,
          amount: txAmount,
          description: description || '',
          reference: reference || null,
          date: txDate,
        },
      });
    } catch (prismaErr) {
      console.warn('Prisma create failed, falling back to Supabase:', prismaErr);
      
      // 2. Fallback to Supabase REST
      const newId = `txn-${Date.now()}`;
      const { data, error } = await supabaseAdmin
        .from('Transaction')
        .insert([{
          id: newId,
          type,
          category,
          amount: txAmount,
          description: description || '',
          reference: reference || null,
          date: txDate.toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single();

      if (!error && data) {
        createdRecord = data;
      }
    }

    // Return created record or formatted response
    const finalData = createdRecord || {
      id: `txn-${Date.now()}`,
      type,
      category,
      amount: txAmount,
      description: description || '',
      reference: reference || null,
      date: txDate.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Financial transaction recorded in database successfully!',
        data: finalData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record transaction' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required for deletion' },
        { status: 400 }
      );
    }

    let deleted = false;

    try {
      await prisma.transaction.delete({ where: { id } });
      deleted = true;
    } catch (err) {
      const { error } = await supabaseAdmin.from('Transaction').delete().eq('id', id);
      if (!error) deleted = true;
    }

    return NextResponse.json({
      success: true,
      message: `Transaction ${id} deleted successfully.`,
      deleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
