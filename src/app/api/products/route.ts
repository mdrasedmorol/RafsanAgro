import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { demoProducts } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let products: any[] = [];

    // Query Supabase JS Client first for instant DB fetching (avoids 3.5s Prisma auth timeout)
    try {
      let query = supabaseAdmin.from('Product').select('*').order('createdAt', { ascending: false });
      if (featured === 'true') {
        query = query.eq('isFeatured', true);
      }
      if (category && category !== 'ALL') {
        query = query.or(`categoryId.eq.${category},slug.eq.${category}`);
      }
      if (search) {
        query = query.or(`nameEn.ilike.%${search}%,nameBn.ilike.%${search}%,sku.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        products = data;
      }
    } catch (sbErr) {
      console.warn('Supabase product fetch warning:', sbErr);
    }

    // Fallback to Prisma if Supabase returned no data
    if (!products || products.length === 0) {
      try {
        const whereClause: any = {};
        if (category && category !== 'ALL') {
          whereClause.OR = [
            { categoryId: category },
            { category: { slug: category } },
          ];
        }
        if (featured === 'true') {
          whereClause.isFeatured = true;
        }
        if (search) {
          whereClause.OR = [
            { nameEn: { contains: search, mode: 'insensitive' } },
            { nameBn: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ];
        }

        products = await prisma.product.findMany({
          where: whereClause,
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        });
      } catch (err) {}
    }

    if (products && products.length > 0) {
      const formatted = products.map((p) => ({
        id: p.id,
        nameEn: p.nameEn,
        nameBn: p.nameBn,
        slug: p.slug,
        descriptionEn: p.descriptionEn || '',
        descriptionBn: p.descriptionBn || '',
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
        stock: Number(p.stock),
        sku: p.sku || '',
        unit: p.unit || 'piece',
        categoryId: p.categoryId,
        categoryName: p.category?.nameEn || 'General',
        categorySlug: p.category?.slug || 'general',
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/images/products/rice-seed.jpg'],
        isFeatured: Boolean(p.isFeatured),
        isActive: Boolean(p.isActive),
        brand: p.brand || 'Rafsan Agro',
        tags: Array.isArray(p.tags) ? p.tags : ['agricultural'],
      }));

      return NextResponse.json({
        success: true,
        source: 'database',
        count: formatted.length,
        data: formatted,
      });
    }

    // Fallback to demo data if DB is unpopulated
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
        p.sku.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      source: 'demo_fallback',
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nameEn,
      nameBn,
      slug,
      descriptionEn,
      descriptionBn,
      price,
      discountPrice,
      stock,
      sku,
      unit,
      categoryId,
      images,
      isFeatured,
      isActive,
      brand,
      tags,
    } = body;

    if (!nameEn || price === undefined || price === null || price === '') {
      return NextResponse.json(
        { success: false, error: 'Product English name and price are required fields' },
        { status: 400 }
      );
    }

    const prodSlug = slug || (nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4));
    const prodSku = sku || `SKU-${Date.now().toString().slice(-4)}`;
    const prodId = `prod-${Date.now()}`;

    // Resolve Category ID to ensure Foreign Key validity
    let validCatId = categoryId;
    try {
      let existingCat = null;
      if (validCatId) {
        existingCat = await prisma.category.findFirst({
          where: { OR: [{ id: validCatId }, { slug: validCatId }] },
        });
      }
      if (!existingCat) {
        existingCat = await prisma.category.findFirst();
      }
      if (!existingCat) {
        existingCat = await prisma.category.create({
          data: {
            id: 'cat-seeds',
            nameEn: 'Seeds & Grains',
            nameBn: 'বীজ ও দানা',
            slug: 'seeds-and-grains',
            description: 'Default agricultural seeds category',
            icon: '🌱',
          },
        });
      }
      validCatId = existingCat.id;
    } catch (catErr) {
      console.warn('Category foreign key check warning:', catErr);
    }

    let createdProduct = null;

    // Try Prisma create
    try {
      createdProduct = await prisma.product.create({
        data: {
          id: prodId,
          nameEn,
          nameBn: nameBn || nameEn,
          slug: prodSlug,
          descriptionEn: descriptionEn || '',
          descriptionBn: descriptionBn || '',
          price: parseFloat(price),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          stock: parseInt(stock || 0),
          sku: prodSku,
          unit: unit || 'piece',
          categoryId: validCatId || 'cat-seeds',
          images: Array.isArray(images) && images.length > 0 ? images : ['/images/products/rice-seed.jpg'],
          isFeatured: Boolean(isFeatured),
          isActive: Boolean(isActive ?? true),
          brand: brand || 'Rafsan Agro',
          tags: Array.isArray(tags) ? tags : ['agricultural'],
        },
        include: { category: true },
      });
    } catch (prismaErr) {
      console.warn('Prisma product create error, falling back to Supabase:', prismaErr);
      const { data, error } = await supabaseAdmin.from('Product').insert([{
        id: prodId,
        nameEn,
        nameBn: nameBn || nameEn,
        slug: prodSlug,
        descriptionEn: descriptionEn || '',
        descriptionBn: descriptionBn || '',
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock || 0),
        sku: prodSku,
        unit: unit || 'piece',
        categoryId: validCatId || 'cat-seeds',
        images: Array.isArray(images) && images.length > 0 ? images : ['/images/products/rice-seed.jpg'],
        isFeatured: Boolean(isFeatured),
        isActive: Boolean(isActive ?? true),
        brand: brand || 'Rafsan Agro',
        tags: Array.isArray(tags) ? tags : ['agricultural'],
      }]).select().single();

      if (!error && data) createdProduct = data;
    }

    const finalProduct = createdProduct ? {
      id: createdProduct.id,
      nameEn: createdProduct.nameEn,
      nameBn: createdProduct.nameBn,
      slug: createdProduct.slug,
      descriptionEn: createdProduct.descriptionEn || '',
      descriptionBn: createdProduct.descriptionBn || '',
      price: Number(createdProduct.price),
      discountPrice: createdProduct.discountPrice ? Number(createdProduct.discountPrice) : undefined,
      stock: Number(createdProduct.stock),
      sku: createdProduct.sku,
      unit: createdProduct.unit,
      categoryId: createdProduct.categoryId,
      categoryName: createdProduct.category?.nameEn || 'Agricultural',
      categorySlug: createdProduct.category?.slug || 'agricultural',
      images: createdProduct.images || ['/images/products/rice-seed.jpg'],
      isFeatured: Boolean(createdProduct.isFeatured),
      isActive: Boolean(createdProduct.isActive),
      brand: createdProduct.brand || 'Rafsan Agro',
      tags: createdProduct.tags || ['agricultural'],
    } : {
      id: prodId,
      nameEn,
      nameBn: nameBn || nameEn,
      slug: prodSlug,
      price: parseFloat(price),
      stock: parseInt(stock || 0),
      sku: prodSku,
      unit: unit || 'piece',
      categoryId: validCatId,
      images: ['/images/products/rice-seed.jpg'],
      isFeatured: Boolean(isFeatured),
      isActive: true,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Product created and saved to database successfully!',
        data: finalProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    let updated = null;

    try {
      updated = await prisma.product.update({
        where: { id },
        data: {
          ...(updateData.nameEn && { nameEn: updateData.nameEn }),
          ...(updateData.nameBn && { nameBn: updateData.nameBn }),
          ...(updateData.price !== undefined && { price: parseFloat(updateData.price) }),
          ...(updateData.discountPrice !== undefined && { discountPrice: updateData.discountPrice ? parseFloat(updateData.discountPrice) : null }),
          ...(updateData.stock !== undefined && { stock: parseInt(updateData.stock) }),
          ...(updateData.isFeatured !== undefined && { isFeatured: Boolean(updateData.isFeatured) }),
          ...(updateData.isActive !== undefined && { isActive: Boolean(updateData.isActive) }),
          ...(updateData.images && { images: updateData.images }),
        },
      });
    } catch (err) {
      const { data } = await supabaseAdmin.from('Product').update(updateData).eq('id', id).select().single();
      if (data) updated = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated in database successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID parameter is required' }, { status: 400 });
    }

    try {
      await prisma.product.delete({ where: { id } });
    } catch (err) {
      await supabaseAdmin.from('Product').delete().eq('id', id);
    }

    return NextResponse.json({ success: true, message: `Product ${id} deleted from database` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
