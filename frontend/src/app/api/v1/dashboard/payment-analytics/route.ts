import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: {
      byMethod: [],
      totalRefunds: 0,
      failedPayments: 0,
    },
  });
}
