import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: {
      data: [],
      meta: { total: 0, unreadCount: 0 },
    },
  });
}
