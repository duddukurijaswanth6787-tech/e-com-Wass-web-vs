import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  });
}
