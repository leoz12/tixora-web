import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import OrdersPageClient from '@/components/pages/OrdersPageClient';

export const metadata: Metadata = {
  title: 'My Orders | Tixora',
  description: 'View your ticket order history',
};

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPageClient />
    </ProtectedRoute>
  );
}
