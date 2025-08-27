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
  Game,
  CreateOrderDto,
  Order,
  AuditLog,
  UpdateAccountDto,
} from "@/types";
import { FormState } from "@/utils/form";
import { generateSalt, hashPassword } from "@/utils/security";
import { paths } from "@/utils/paths";

const AppContext = createContext<ReturnType<typeof useProvideApp> | undefined>(
  undefined
);

const useProvideApp = () => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>();
  const [games, setGames] = useState<Game[]>();
  const [accounts, setAccounts] = useState<Account[]>();
  const [accountsLoading, setAccountsLoading] = useState<boolean>(false);
  const [gamesLoading, setGamesLoading] = useState<boolean>(false);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [auditLogsLoading, setAuditLogsLoading] = useState<boolean>(false);
  const [publicAccounts, setPublicAccounts] = useState<Account[]>();

  const [orders, setOrders] = useState<Order[]>();
  const isAuthenticated = useMemo(() => {
    return !!currentUser && !!localStorage.getItem("token");
  }, [currentUser]);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
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
    async (credentials: FormState) => {
      setLoading(true);

      try {
        if (!credentials.password || !credentials.email) {
          throw new Error("Invalid or empty credentials");
        }
        const sessionResponse = await request.post("/auth/init-session");
        const { uuid } = sessionResponse.data;
        const salt = generateSalt();
        const hashedPassword = hashPassword(credentials.password);
        const response = await request.post("/auth/login", {
          uuid,
          email: credentials.email,
          hashedPassword,
          salt,
        });

        const { access_token, user } = response.data;

        localStorage.setItem("token", access_token);
        request.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        setCurrentUser(user);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (userData: RegisterDto) => {
      try {
        const response = await request.post("/auth/register", {
          name: userData.name,
          email: userData.email,
          hashedPassword: userData.hashedPassword,
        });
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
  const logout = useCallback(async () => {
    localStorage.removeItem("token");
    request.defaults.headers.common["Authorization"] = "";
    setCurrentUser(undefined);

    router.push(paths.login);
  }, [router]);

  const fetchAccounts = useCallback(async () => {
    setAccountsLoading(true);
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
      if (newAccount) {
        fetchAccounts();
      }
      return newAccount;
    } catch (error: any) {
      console.error("Failed to create account:", error);
      throw error;
    }
  }, []);

  const createGame = useCallback(async (data: { name: string }) => {
    try {
      const result = await request.post("/games", data);
      const newGame = result.data;
      if (newGame) {
        fetchGames();
      }
    } catch (error: any) {
      console.error("Failed to create game:", error);
      throw error;
    }
  }, []);

  const updateGame = useCallback(
    async (id: number, data: Partial<{ name: string }>) => {
      try {
        const result = await request.patch(`/games/${id}`, data);
        const updatedGame = result.data;
        setGames((prev) =>
          prev?.map((game) => (game.id === id ? updatedGame : game))
        );
        return updatedGame;
      } catch (error: any) {
        console.error("Failed to update game:", error);
        throw error;
      }
    },
    []
  );

  const deleteGame = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await request.delete(`/games/${id}`);
      setGames((prev) => prev?.filter((game) => game.id !== id));
    } catch (error: any) {
      console.error("Failed to delete game:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccount = useCallback(
    async (id: number, data: UpdateAccountDto) => {
      try {
        const result = await request.put(`/accounts/${id}`, data);
        const updatedAccount = result.data;
        setAccounts((prev) =>
          prev?.map((account) => (account.id === id ? updatedAccount : account))
        );
        return updatedAccount;
      } catch (error: any) {
        console.error("Failed to update account:", error);
        throw error;
      }
    },
    []
  );

  const deleteAccount = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await request.delete(`/accounts/${id}`);
      setAccounts((prev) => prev?.filter((account) => account.id !== id));
    } catch (error: any) {
      console.error("Failed to delete candidate:", error);
      throw error;
    } finally {
    }
  }, []);

  const fetchGames = useCallback(async () => {
    setGamesLoading(true);
    try {
      const result = await request.get("/games");
      const fetchedGames = result.data;
      setGames(fetchedGames);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setGamesLoading(false);
    }
  }, []);

  const fetchPublicAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await request.get("/accounts/public");
      const fetchedAccounts = result.data;
      setPublicAccounts(fetchedAccounts);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const result = await request.get("/orders");
      const fetchedOrders = result.data;
      setOrders(fetchedOrders);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: CreateOrderDto) => {
    try {
      const result = await request.post("/orders", data);
      if (result.data) {
        fetchOrders();
      }
    } catch (error: any) {
      console.error("Failed to create order:", error);
      throw error;
    }
  }, []);

  const deleteOrder = useCallback(async (id: number) => {
    try {
      await request.delete(`/orders/${id}`);
      setOrders((prev) => prev?.filter((order) => order.id !== id));
    } catch (error: any) {
      console.error("Failed to delete order:", error);
      throw error;
    }
  }, []);

  const updateOrder = useCallback(
    async (id: number, data: Partial<CreateOrderDto>) => {
      try {
        const result = await request.put(`/orders/${id}`, data);
        const updatedOrder = result.data;
        setOrders((prev) =>
          prev?.map((order) => (order.id === id ? updatedOrder : order))
        );
        return updatedOrder;
      } catch (error: any) {
        console.error("Failed to update order:", error);
        throw error;
      }
    },
    []
  );

  const fetchAuditLogs = useCallback(async () => {
    setAuditLogsLoading(true);
    try {
      const result = await request.get("/audit-logs");
      const fetchedAuditLogs = result.data;

      setAuditLogs(fetchedAuditLogs);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setAuditLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !currentUser) {
      fetchCurrentUser();
    } else if (!token) {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

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
    setCurrentUser,
    fetchGames,
    games,
    createGame,
    updateGame,
    deleteGame,
    updateAccount,
    fetchPublicAccounts,
    publicAccounts,
    fetchOrders,
    orders,
    createOrder,
    deleteOrder,
    updateOrder,
    fetchAuditLogs,
    auditLogs,
    auditLogsLoading,
    ordersLoading,
    gamesLoading,
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
