import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: {
      paymentMethods: {},
      totalPaid: 0,
      settledAmount: 0,
    },
  });
}
