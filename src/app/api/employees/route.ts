import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all employees
export async function GET() {
  try {
    const employees = await prisma.employeeAdmin.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Omit passwords from response
    const safeEmployees = employees.map(({ password, ...rest }) => rest);
    
    return NextResponse.json(safeEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

// POST create employee
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, categories, autoPublish } = body;

    if (!name || !email || !password || !categories) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check unique email
    const existing = await prisma.employeeAdmin.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const categoriesStr = typeof categories === 'string' ? categories : JSON.stringify(categories);

    const newEmployee = await prisma.employeeAdmin.create({
      data: {
        name,
        email,
        password, // stored plain text to align with the current superadmin plain text setup
        categories: categoriesStr,
        autoPublish: !!autoPublish,
      },
    });

    const { password: _, ...safeEmployee } = newEmployee;
    return NextResponse.json(safeEmployee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

// PUT update employee
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, password, categories, autoPublish } = body;

    if (!id || !name || !email || !categories) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email taken by other employee
    const existing = await prisma.employeeAdmin.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const categoriesStr = typeof categories === 'string' ? categories : JSON.stringify(categories);

    const updateData: any = {
      name,
      email,
      categories: categoriesStr,
      autoPublish: !!autoPublish,
    };

    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    const updatedEmployee = await prisma.employeeAdmin.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...safeEmployee } = updatedEmployee;
    return NextResponse.json(safeEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing employee id' }, { status: 400 });
    }

    await prisma.employeeAdmin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
