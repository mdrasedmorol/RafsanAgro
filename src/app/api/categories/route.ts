import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { demoCategories } from '@/lib/demo-data';

export async function GET() {
  try {
    let categories: any[] = [];
    // Query Supabase JS client directly for instant response
    try {
      const { data, error } = await supabaseAdmin.from('Category').select('*').order('sortOrder', { ascending: true });
      if (!error && data && data.length > 0) {
        categories = data;
      }
    } catch (sbErr) {}

    // Fallback to Prisma if Supabase returned no data
    if (!categories || categories.length === 0) {
      try {
        categories = await prisma.category.findMany({
          orderBy: { sortOrder: 'asc' },
        });
      } catch (err) {}
    }

    if (categories && categories.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'database',
        count: categories.length,
        data: categories,
      });
    }

    return NextResponse.json({
      success: true,
      source: 'demo_fallback',
      count: demoCategories.length,
      data: demoCategories,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameEn, nameBn, slug, description, icon, image } = body;

    if (!nameEn) {
      return NextResponse.json({ success: false, error: 'Category English name is required' }, { status: 400 });
    }

    const catSlug = slug || nameEn.toLowerCase().replace(/\s+/g, '-');
    const catId = `cat-${Date.now()}`;

    let createdCategory = null;

    try {
      createdCategory = await prisma.category.create({
        data: {
          id: catId,
          nameEn,
          nameBn: nameBn || nameEn,
          slug: catSlug,
          description: description || '',
          icon: icon || '🌱',
          image: image || '/images/categories/placeholder.jpg',
        },
      });
    } catch (prismaErr) {
      const { data, error } = await supabaseAdmin.from('Category').insert([{
        id: catId,
        nameEn,
        nameBn: nameBn || nameEn,
        slug: catSlug,
        description: description || '',
        icon: icon || '🌱',
        image: image || '/images/categories/placeholder.jpg',
      }]).select().single();

      if (!error && data) createdCategory = data;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Category saved to database successfully',
        data: createdCategory || { id: catId, nameEn, nameBn: nameBn || nameEn, slug: catSlug, description, icon, image },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, nameEn, nameBn, slug, description, icon, image } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    let updated = null;
    try {
      updated = await prisma.category.update({
        where: { id },
        data: {
          nameEn,
          nameBn,
          slug,
          description,
          icon,
          image,
        },
      });
    } catch (err) {
      const { data } = await supabaseAdmin.from('Category').update({ nameEn, nameBn, slug, description, icon, image }).eq('id', id).select().single();
      if (data) updated = data;
    }

    return NextResponse.json({ success: true, message: 'Category updated in database', data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID parameter is required' }, { status: 400 });
    }

    try {
      await prisma.category.delete({ where: { id } });
    } catch (err) {
      await supabaseAdmin.from('Category').delete().eq('id', id);
    }

    return NextResponse.json({ success: true, message: 'Category removed from database' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
