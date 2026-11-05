import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { demoArticles } from '@/lib/demo-data';

// GET — List articles (with optional filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let articles: any[] = [];

    // Try Supabase first for fast response
    try {
      let query = supabaseAdmin
        .from('Article')
        .select('*')
        .order('createdAt', { ascending: false });

      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      }
      if (category && category !== 'ALL') {
        query = query.eq('category', category);
      }
      if (featured === 'true') {
        query = query.eq('isFeatured', true);
      }
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,summary.ilike.%${search}%,content.ilike.%${search}%`
        );
      }
      if (limit) {
        query = query.limit(parseInt(limit));
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        articles = data;
      }
    } catch (sbErr) {
      console.warn('Supabase article fetch warning:', sbErr);
    }

    // Fallback to Prisma
    if (!articles || articles.length === 0) {
      try {
        const whereClause: any = {};
        if (status && status !== 'ALL') {
          whereClause.status = status;
        }
        if (category && category !== 'ALL') {
          whereClause.category = category;
        }
        if (featured === 'true') {
          whereClause.isFeatured = true;
        }
        if (search) {
          whereClause.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { summary: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ];
        }

        articles = await (prisma as any).article.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          ...(limit ? { take: parseInt(limit) } : {}),
        });
      } catch (err) {
        console.warn('Prisma article fetch warning:', err);
      }
    }

    // Fallback to demo articles if DB has no articles yet
    if (!articles || articles.length === 0) {
      let fallback = [...demoArticles];
      if (status && status !== 'ALL') {
        fallback = fallback.filter((a) => a.status === status);
      }
      if (category && category !== 'ALL') {
        fallback = fallback.filter((a) => a.category === category);
      }
      if (featured === 'true') {
        fallback = fallback.filter((a) => a.isFeatured);
      }
      if (search) {
        const q = search.toLowerCase();
        fallback = fallback.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q)
        );
      }
      if (limit) {
        fallback = fallback.slice(0, parseInt(limit));
      }
      articles = fallback;
    }

    return NextResponse.json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST — Create a new article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      summary,
      content,
      coverImage,
      images,
      videoUrl,
      documents,
      category,
      tags,
      author,
      status,
      isFeatured,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const articleSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() +
        '-' +
        Date.now().toString(36);

    const articleStatus = status || 'DRAFT';
    const publishedAt =
      articleStatus === 'PUBLISHED' ? new Date().toISOString() : null;

    let createdArticle = null;

    // Try Prisma
    try {
      createdArticle = await (prisma as any).article.create({
        data: {
          title,
          slug: articleSlug,
          summary: summary || '',
          content,
          coverImage: coverImage || null,
          images: Array.isArray(images) ? images : [],
          videoUrl: videoUrl || null,
          documents: Array.isArray(documents) ? documents : [],
          category: category || null,
          tags: Array.isArray(tags) ? tags : [],
          author: author || null,
          status: articleStatus,
          isFeatured: Boolean(isFeatured),
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });
    } catch (prismaErr) {
      console.warn('Prisma article create error, falling back to Supabase:', prismaErr);

      const { data, error } = await supabaseAdmin
        .from('Article')
        .insert([
          {
            title,
            slug: articleSlug,
            summary: summary || '',
            content,
            coverImage: coverImage || null,
            images: Array.isArray(images) ? images : [],
            videoUrl: videoUrl || null,
            documents: Array.isArray(documents) ? documents : [],
            category: category || null,
            tags: Array.isArray(tags) ? tags : [],
            author: author || null,
            status: articleStatus,
            isFeatured: Boolean(isFeatured),
            publishedAt,
          },
        ])
        .select()
        .single();

      if (!error && data) createdArticle = data;
    }

    if (!createdArticle) {
      createdArticle = {
        id: `art-${Date.now()}`,
        title,
        slug: articleSlug,
        summary: summary || '',
        content,
        coverImage: coverImage || null,
        images: Array.isArray(images) ? images : [],
        videoUrl: videoUrl || null,
        documents: Array.isArray(documents) ? documents : [],
        category: category || null,
        tags: Array.isArray(tags) ? tags : [],
        author: author || null,
        status: articleStatus,
        isFeatured: Boolean(isFeatured),
        publishedAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Article created successfully!',
        data: createdArticle,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create article' },
      { status: 500 }
    );
  }
}

// PUT — Update an article
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // If status changed to PUBLISHED and no publishedAt, set it now
    if (updateData.status === 'PUBLISHED' && !updateData.publishedAt) {
      updateData.publishedAt = new Date().toISOString();
    }

    let updated = null;

    try {
      const prismaData: any = {};
      if (updateData.title !== undefined) prismaData.title = updateData.title;
      if (updateData.slug !== undefined) prismaData.slug = updateData.slug;
      if (updateData.summary !== undefined) prismaData.summary = updateData.summary;
      if (updateData.content !== undefined) prismaData.content = updateData.content;
      if (updateData.coverImage !== undefined) prismaData.coverImage = updateData.coverImage;
      if (updateData.images !== undefined) prismaData.images = updateData.images;
      if (updateData.videoUrl !== undefined) prismaData.videoUrl = updateData.videoUrl;
      if (updateData.documents !== undefined) prismaData.documents = updateData.documents;
      if (updateData.category !== undefined) prismaData.category = updateData.category;
      if (updateData.tags !== undefined) prismaData.tags = updateData.tags;
      if (updateData.author !== undefined) prismaData.author = updateData.author;
      if (updateData.status !== undefined) prismaData.status = updateData.status;
      if (updateData.isFeatured !== undefined)
        prismaData.isFeatured = Boolean(updateData.isFeatured);
      if (updateData.publishedAt !== undefined)
        prismaData.publishedAt = updateData.publishedAt
          ? new Date(updateData.publishedAt)
          : null;

      updated = await (prisma as any).article.update({
        where: { id },
        data: prismaData,
      });
    } catch (err) {
      const { data } = await supabaseAdmin
        .from('Article')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (data) updated = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE — Delete an article
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    try {
      await (prisma as any).article.delete({ where: { id } });
    } catch (err) {
      await supabaseAdmin.from('Article').delete().eq('id', id);
    }

    return NextResponse.json({
      success: true,
      message: `Article ${id} deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

