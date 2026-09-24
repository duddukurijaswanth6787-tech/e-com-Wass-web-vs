import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    info: {
      database: { status: 'up', connected: true },
      storage: { status: 'up', provider: 's3', bucket: 'boutique-media-848910045051-hyd' },
      app: { status: 'up', store: 'Vasanti Creations' },
    },
  });
}
