"use client";

import { paths } from "@/utils/paths";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import {
  fetchCurrentUser,
  selectCurrentUser,
  selectLoading,
} from "@/stores(REDUX)/slices/auth-slice";

export const withAuthCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuthCheckComponent = (props: P) => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const loading = useAppSelector(selectLoading);
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token && !currentUser && !loading) {
        dispatch(fetchCurrentUser());
      } else if (!token) {
        setIsChecking(false);
        router.push(paths.login);
      }
    }, [dispatch, currentUser, loading, router]);

    useEffect(() => {
      if (currentUser) {
        setIsChecking(false);
      } else if (!loading && !currentUser) {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push(paths.login);
        }
      }
    }, [currentUser, loading, router]);

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
