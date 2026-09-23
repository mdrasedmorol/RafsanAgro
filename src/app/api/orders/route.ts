import { NextResponse } from 'next/server';
import { demoOrders } from '@/lib/demo-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const orderNumber = searchParams.get('orderNumber');

  let results = [...demoOrders];

  if (orderNumber) {
    const found = results.find(o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
    return NextResponse.json({
      success: !!found,
      data: found || null,
    });
  }

  if (status && status !== 'ALL') {
    results = results.filter(o => o.status === status);
  }

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
    count: results.length,
    data: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate Order Number
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const orderNumber = `RA-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber,
      status: 'PENDING',
      customerName: body.customerName || 'Valued Customer',
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      customerArea: body.customerArea || 'Dhaka',
      subtotal: body.subtotal || 0,
      deliveryCharge: body.deliveryCharge || 80,
      total: (body.subtotal || 0) + (body.deliveryCharge || 80),
      paymentMethod: body.paymentMethod || 'CASH_ON_DELIVERY',
      paymentStatus: body.paymentMethod === 'CASH_ON_DELIVERY' ? 'UNPAID' : 'PENDING',
      items: body.items || [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully!',
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process order' },
      { status: 400 }
    );
  }
}
