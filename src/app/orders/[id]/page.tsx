import { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import OrderDetailPageClient from "@/components/pages/OrderDetailPageClient";

export const metadata: Metadata = {
  title: "Order Details | Tixora",
  description: "View your order and ticket details",
};

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <OrderDetailPageClient orderId={id} />
    </ProtectedRoute>
  );
}
