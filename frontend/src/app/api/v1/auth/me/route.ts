import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: {
      id: 'admin-super-id',
      email: 'admin@vasanticreations.com',
      firstName: 'Vasanti',
      lastName: 'Admin',
      userType: 'ADMIN',
      accountStatus: 'ACTIVE',
      roles: ['super_admin', 'admin'],
      permissions: ['*'],
    },
  });
}
