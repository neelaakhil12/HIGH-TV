import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const employee = await prisma.employeeAdmin.findUnique({
      where: { email },
    });

    if (!employee || employee.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    let parsedCategories = [];
    try {
      parsedCategories = JSON.parse(employee.categories);
    } catch {
      parsedCategories = [];
    }

    return NextResponse.json({
      success: true,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        categories: parsedCategories,
      },
    });
  } catch (error) {
    console.error('Error in employee login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
