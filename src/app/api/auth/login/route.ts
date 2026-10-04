import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const DEMO_EMAIL = 'mdrasedmorol@gmail.com';
const DEMO_PASS = 'Rashed123@';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter both email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const isDemoMatch = cleanEmail === DEMO_EMAIL.toLowerCase() && password === DEMO_PASS;

    // Check Prisma DB User table first
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.warn('Prisma DB lookup warning:', dbErr);
    }

    let isValid = false;

    if (user) {
      // Check bcrypt password match or fallback direct match
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isValid = await bcrypt.compare(password, user.password);
      } else {
        isValid = user.password === password;
      }
    } else if (isDemoMatch) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const responseUser = {
      id: user?.id || 'admin-demo-1',
      name: user?.name || 'Rashed Morol',
      email: user?.email || DEMO_EMAIL,
      role: user?.role || 'SUPER_ADMIN',
    };

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: responseUser,
    });

    // Set auth session cookie
    response.cookies.set('admin_session', JSON.stringify(responseUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('admin_session');
  return response;
}
