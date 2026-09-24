import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: {
      totalRevenue: 0,
      todayRevenue: 0,
      totalOrders: 0,
      todayOrders: 0,
      avgOrderValue: 0,
      totalCustomers: 0,
      totalProducts: 0,
      totalCategories: 0,
      totalBrands: 0,
      pendingOrders: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      recentOrders: [],
      topProducts: [],
      revenueChangePercent: 0,
      ordersChangePercent: 0,
      customersCount: 0,
      productsCount: 0,
      pendingRefunds: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      unreadReviewsCount: 0,
      openTicketsCount: 0,
      returnsCount: 0,
      cancelledOrders: 0,
    },
  });
}
