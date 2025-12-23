import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    console.log('Login attempt for:', email.toLowerCase());
    
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    console.log('Admin found:', admin ? 'yes' : 'no');

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Comparing passwords...');
    const isValid = await verifyPassword(password, admin.password);
    console.log('Password valid:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        }
      },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
