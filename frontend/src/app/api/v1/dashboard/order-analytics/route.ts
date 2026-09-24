import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: {
      statusBreakdown: {},
      totalOrders: 0,
      fulfillmentRate: 100,
    },
  });
}
