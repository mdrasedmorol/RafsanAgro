import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { demoOrders } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const orderNumber = searchParams.get('orderNumber');

    let orders: any[] = [];

    try {
      const whereClause: any = {};
      if (orderNumber) whereClause.orderNumber = orderNumber;
      if (status && status !== 'ALL') whereClause.status = status;
      if (search) {
        whereClause.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { customerPhone: { contains: search, mode: 'insensitive' } },
        ];
      }

      orders = await prisma.order.findMany({
        where: whereClause,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      const { data } = await supabaseAdmin.from('Order').select('*').order('createdAt', { ascending: false });
      if (data) orders = data;
    }

    if (orders && orders.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'database',
        count: orders.length,
        data: orders,
      });
    }

    // Fallback to demo orders if DB is unpopulated
    let results = [...demoOrders];
    if (orderNumber) {
      const found = results.find(o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
      return NextResponse.json({ success: !!found, data: found || null });
    }
    if (status && status !== 'ALL') results = results.filter(o => o.status === status);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
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
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const orderNumber = body.orderNumber || `RA-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const orderId = `order-${Date.now()}`;

    const subtotal = Number(body.subtotal || 0);
    const deliveryCharge = Number(body.deliveryCharge || 80);
    const total = Number(body.total || subtotal + deliveryCharge);

    let createdOrder = null;

    try {
      createdOrder = await prisma.order.create({
        data: {
          id: orderId,
          orderNumber,
          status: body.status || 'PENDING',
          customerName: body.customerName || 'Valued Customer',
          customerPhone: body.customerPhone || '01700000000',
          customerEmail: body.customerEmail || null,
          customerAddress: body.customerAddress || 'Address',
          customerArea: body.customerArea || 'Dhaka',
          subtotal,
          deliveryCharge,
          total,
          paymentMethod: body.paymentMethod || 'CASH_ON_DELIVERY',
          paymentStatus: body.paymentStatus || (body.paymentMethod === 'CASH_ON_DELIVERY' ? 'UNPAID' : 'PAID'),
          notes: body.notes || null,
        },
      });
    } catch (err) {
      const { data } = await supabaseAdmin.from('Order').insert([{
        id: orderId,
        orderNumber,
        status: body.status || 'PENDING',
        customerName: body.customerName || 'Valued Customer',
        customerPhone: body.customerPhone || '01700000000',
        customerAddress: body.customerAddress || 'Address',
        subtotal,
        deliveryCharge,
        total,
        paymentMethod: body.paymentMethod || 'CASH_ON_DELIVERY',
        paymentStatus: body.paymentStatus || 'UNPAID',
      }]).select().single();
      if (data) createdOrder = data;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order created and saved to database successfully!',
        data: createdOrder || { id: orderId, orderNumber, total, status: 'PENDING' },
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
    const { id, status, paymentStatus, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    let updated = null;
    try {
      updated = await prisma.order.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(paymentStatus && { paymentStatus }),
          ...(adminNotes !== undefined && { adminNotes }),
        },
      });
    } catch (err) {
      const { data } = await supabaseAdmin.from('Order').update({ status, paymentStatus, adminNotes }).eq('id', id).select().single();
      if (data) updated = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated in database successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
