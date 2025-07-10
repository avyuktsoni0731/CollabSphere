"use client";

import type React from "react";

import { useAuthUser } from "@/lib/useAuthUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthWrapper({
  children,
  requireAuth = true,
}: AuthWrapperProps) {
  const { user, loading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push("/auth");
    }
  }, [user, loading, requireAuth, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect to auth page
  }

  return <>{children}</>;
}
