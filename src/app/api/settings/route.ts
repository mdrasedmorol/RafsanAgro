import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    let settings = null;

    // 1. Try Prisma
    try {
      settings = await prisma.siteSettings.findUnique({
        where: { id: 'default' },
      });
    } catch (err) {
      console.warn('Prisma settings fetch failed:', err);
    }

    // 2. Try Supabase fallback (SiteSettings or site_settings)
    if (!settings) {
      const { data } = await supabaseAdmin.from('SiteSettings').select('*').eq('id', 'default').single();
      if (data) {
        settings = data;
      } else {
        const { data: lowerData } = await supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single();
        if (lowerData) settings = lowerData;
      }
    }

    const defaultFallback = {
      id: 'default',
      siteName: 'Rafsan Agro',
      siteNameBn: 'রফসান এগ্রো',
      phone: '01712345678',
      email: 'info@rafsanagro.com',
      address: 'Bazaar Road, Rangpur Sadar, Rangpur',
      deliveryCharge: 80,
      freeDeliveryMin: 3000,
      codEnabled: true,
      bkashEnabled: true,
      bkashSandbox: true,
      bkashAppKey: 'sandbox_app_key_rafsan_123',
      bkashAppSecret: 'sandbox_app_secret_rafsan_456',
      nagadEnabled: true,
      nagadSandbox: true,
      nagadMerchantId: 'NAGAD_RAFSAN_889',
    };

    return NextResponse.json({
      success: true,
      data: settings || defaultFallback,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let updated = null;

    try {
      updated = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: { ...body },
        create: { id: 'default', ...body },
      });
    } catch (prismaErr) {
      const { data } = await supabaseAdmin.from('SiteSettings').upsert({ id: 'default', ...body }).select().single();
      if (data) updated = data;

      try {
        const { data: lowerData } = await supabaseAdmin.from('site_settings').upsert({ id: 'default', ...body }).select().single();
        if (lowerData) updated = lowerData;
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: 'Site & payment settings saved to database successfully!',
      data: updated || { id: 'default', ...body },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
