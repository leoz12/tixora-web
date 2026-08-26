import { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProfilePageClient from "@/components/pages/ProfilePageClient";

export const metadata: Metadata = {
  title: "My Profile | Tixora",
  description: "View your Tixora account profile",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageClient />
    </ProtectedRoute>
  );
}
