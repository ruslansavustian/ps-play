"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import request from "@/lib/request";
import {
  User,
  LoginDto,
  RegisterDto,
  AuthResponse,
  CreateAccountDto,
  Account,
} from "@/types";

const AppContext = createContext<ReturnType<typeof useProvideApp> | undefined>(
  undefined
);

const useProvideApp = () => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(false);

  const isAuthenticated = useMemo(() => {
    return !!currentUser && !!localStorage.getItem("token");
  }, [currentUser]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const result = await request.get("/auth/profile");
      const userData = result.data;
      setCurrentUser(userData);
    } catch (error: any) {
      console.log("error", error);

      localStorage.removeItem("token");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginDto) => {
      console.log("Attempting login for:", credentials.email);
      try {
        const response = await request.post("/auth/login", credentials);
        console.log("Login response:", response.status);
        const { access_token, user } = response.data;

        localStorage.setItem("token", access_token);
        request.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;

        setCurrentUser(user);
        router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [router]
  );

  const register = useCallback(
    async (userData: RegisterDto) => {
      try {
        const response = await request.post("/auth/register", userData);
        const { access_token, user } = response.data;

        // Store token
        localStorage.setItem("token", access_token);
        request.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;

        setCurrentUser(user);
        router.push("/dashboard");
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    [router]
  );

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    request.defaults.headers.common["Authorization"] = "";
    setCurrentUser(null);
    setAccounts([]);
    router.push("/login");
  }, [router]);

  // Load candidates
  const fetchAccounts = useCallback(async () => {
    try {
      setAccountsLoading(true);
      const result = await request.get("/accounts");
      const fetchedAccounts = result.data;
      setAccounts(fetchedAccounts);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  const createAccount = useCallback(async (data: CreateAccountDto) => {
    try {
      const result = await request.post("/accounts", data);
      const newAccount = result.data;
      setAccounts((prev) => [...prev, newAccount]);
      return newAccount;
    } catch (error: any) {
      console.error("Failed to create account:", error);
      throw error;
    }
  }, []);

  // const updateAccount = useCallback(
  //   async (id: number, data: Partial<CreateAccountDto>) => {
  //     try {
  //       const result = await request.put(`/candidates/${id}`, data);
  //       const updatedCandidate = result.data;
  //       setAccounts((prev) =>
  //         prev.map((account) =>
  //           account.id === id ? updateAccount : account
  //         )
  //       );
  //       return updatedCandidate;
  //     } catch (error: any) {
  //       console.error("Failed to update candidate:", error);
  //       throw error;
  //     }
  //   },
  //   []
  // );

  const deleteAccount = useCallback(async (id: number) => {
    try {
      await request.delete(`/accounts/${id}`);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
    } catch (error: any) {
      console.error("Failed to delete candidate:", error);
      throw error;
    }
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     fetchCurrentUser();
  //   } else {
  //     setLoading(false);
  //     router.push("/login");
  //   }
  // }, [fetchCurrentUser, router]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchCandidates();
  //   }
  // }, [isAuthenticated, fetchCandidates]);

  return {
    currentUser,
    isAuthenticated,
    loading,
    accounts,
    accountsLoading,
    login,
    register,
    logout,
    fetchCurrentUser,
    fetchAccounts,
    createAccount,
    deleteAccount,
  };
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const app = useProvideApp();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
