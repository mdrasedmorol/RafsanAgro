import { NextResponse } from 'next/server';
import { demoProducts } from '@/lib/demo-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  let results = [...demoProducts];

  if (category && category !== 'ALL') {
    results = results.filter(p => p.categoryId === category || p.categorySlug === category);
  }

  if (featured === 'true') {
    results = results.filter(p => p.isFeatured);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.nameEn.toLowerCase().includes(q) ||
      p.nameBn.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: 'Product created successfully', data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid product data payload' },
      { status: 400 }
    );
  }
}
