import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@redline.com' });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin already exists',
        email: 'admin@redline.com'
      });
    }

    // Create admin user
    const hashedPassword = await hashPassword('Admin@123456');
    await Admin.create({
      email: 'admin@redline.com',
      password: hashedPassword,
      name: 'Admin',
    });

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      email: 'admin@redline.com',
      password: 'Admin@123456'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    );
  }
}
