"use client";

import { useApp } from "@/contexts/AppProvider";
import { paths } from "@/utils/paths";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WithAuthCheckProps {
  children: React.ReactNode;
}

export const withAuthCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuthCheckComponent = (props: P) => {
    const { currentUser, loading, fetchCurrentUser } = useApp();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        setIsChecking(true);

        if (!currentUser) {
          router.push(paths.login);
        }
        if (currentUser) {
          router.push(paths.dashboard);
          setIsChecking(false);
        }
      };

      checkAuth();
    }, [currentUser, router]);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token && !currentUser && !loading) {
        setIsChecking(true);
      }
    }, [currentUser, loading]);

    if (loading || isChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Проверка авторизации...</div>
        </div>
      );
    }

    if (!currentUser) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthCheckComponent.displayName = `withAuthCheck(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithAuthCheckComponent;
};
