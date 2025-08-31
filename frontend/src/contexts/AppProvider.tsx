"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { useRouter } from "next/navigation";
import request from "@/lib/request";
import {
  User,
  RegisterDto,
  Account,
  Game,
  CreateOrderDto,
  Order,
  AuditLog,
} from "@/types";
import { FormState } from "@/utils/form";
import { generateSalt, hashPassword } from "@/utils/security";
import { paths } from "@/utils/paths";
import { extractErrorMessage } from "@/utils/error-helper";

// ---------------- STATE ----------------

type State = {
  currentUser: User | null;
  loading: boolean;
  auditLogs?: AuditLog[];
  accounts?: Account[];
  accountsLoading: boolean;
  games?: Game[];
  gamesLoading: boolean;
  orders?: Order[];
  ordersLoading: boolean;
  auditLogsLoading: boolean;
  publicAccounts?: Account[];
  errorMessage?: string;
};

const initialState: State = {
  currentUser: null,
  loading: false,
  accountsLoading: false,
  gamesLoading: false,
  ordersLoading: false,
  auditLogsLoading: false,
  errorMessage: "",
};

// ---------------- ACTIONS ----------------

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ACCOUNTS"; payload: Account[] }
  | { type: "ADD_ACCOUNT"; payload: Account }
  | { type: "UPDATE_ACCOUNT"; payload: Account }
  | { type: "DELETE_ACCOUNT"; payload: number }
  | { type: "SET_GAMES"; payload: Game[] }
  | { type: "ADD_GAME"; payload: Game }
  | { type: "UPDATE_GAME"; payload: Game }
  | { type: "DELETE_GAME"; payload: number }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "DELETE_ORDER"; payload: number }
  | { type: "SET_AUDIT_LOGS"; payload: AuditLog[] }
  | { type: "SET_PUBLIC_ACCOUNTS"; payload: Account[] }
  | { type: "SET_LOADING_FLAG"; payload: { key: keyof State; value: boolean } }
  | { type: "SET_ERROR_MESSAGE"; payload: string };

// ---------------- REDUCER ----------------

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return { ...state, currentUser: action.payload };
    case "SET_ACCOUNTS":
      return { ...state, accounts: action.payload };
    case "ADD_ACCOUNT":
      return {
        ...state,
        accounts: [...(state.accounts || []), action.payload],
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts?.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case "DELETE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts?.filter((a) => a.id !== action.payload),
      };
    case "SET_GAMES":
      return { ...state, games: action.payload };
    case "ADD_GAME":
      return { ...state, games: [...(state.games || []), action.payload] };
    case "UPDATE_GAME":
      return {
        ...state,
        games: state.games?.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case "DELETE_GAME":
      return {
        ...state,
        games: state.games?.filter((g) => g.id !== action.payload),
      };
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "ADD_ORDER":
      return { ...state, orders: [...(state.orders || []), action.payload] };
    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders?.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    case "DELETE_ORDER":
      return {
        ...state,
        orders: state.orders?.filter((o) => o.id !== action.payload),
      };
    case "SET_AUDIT_LOGS":
      return { ...state, auditLogs: action.payload };
    case "SET_PUBLIC_ACCOUNTS":
      return { ...state, publicAccounts: action.payload };
    case "SET_LOADING_FLAG":
      return { ...state, [action.payload.key]: action.payload.value };
    case "SET_ERROR_MESSAGE":
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
}

// ---------------- HOOK ----------------

const AppContext = createContext<ReturnType<typeof useProvideApp> | undefined>(
  undefined
);

const useProvideApp = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const isAuthenticated = useMemo(
    () => !!state.currentUser && !!localStorage.getItem("token"),
    [state.currentUser]
  );

  // ---------------- AUTH ----------------

  const fetchCurrentUser = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await request.get("/auth/profile");
      dispatch({ type: "SET_USER", payload: result.data });
    } catch (error: any) {
      console.error(error);
      localStorage.removeItem("token");
      dispatch({ type: "SET_USER", payload: null });

      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = useCallback(async (credentials: FormState) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const sessionResponse = await request.post("/auth/init-session");
      const { uuid } = sessionResponse.data;
      const salt = generateSalt();
      const hashedPassword = hashPassword(credentials.password!);
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
      dispatch({ type: "SET_USER", payload: user });
      router.push(paths.dashboard);
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const register = useCallback(
    async (userData: RegisterDto) => {
      try {
        const response = await request.post("/auth/register", userData);
        if (response) {
          const { access_token, user } = response.data;
          localStorage.setItem("token", access_token);
          request.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
          dispatch({ type: "SET_USER", payload: user });
          router.push("/dashboard");
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR_MESSAGE",
          payload: extractErrorMessage(error),
        });
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    request.defaults.headers.common["Authorization"] = "";
    dispatch({ type: "SET_USER", payload: null });
    router.push(paths.login);
  }, [router]);

  // ---------------- DATA ----------------

  const fetchAccounts = useCallback(async () => {
    dispatch({
      type: "SET_LOADING_FLAG",
      payload: { key: "accountsLoading", value: true },
    });
    try {
      const result = await request.get("/accounts");
      dispatch({ type: "SET_ACCOUNTS", payload: result.data });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    } finally {
      dispatch({
        type: "SET_LOADING_FLAG",
        payload: { key: "accountsLoading", value: false },
      });
    }
  }, []);

  const createAccount = useCallback(async (data: Account) => {
    try {
      dispatch({ type: "SET_ERROR_MESSAGE", payload: "" });

      const result = await request.post("/accounts", data);
      dispatch({ type: "ADD_ACCOUNT", payload: result.data });
      return result.data;
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    }
  }, []);

  const updateAccount = useCallback(async (id: number, data: Account) => {
    try {
      // Очищаем предыдущие ошибки
      dispatch({ type: "SET_ERROR_MESSAGE", payload: "" });

      const result = await request.put(`/accounts/${id}`, data);
      dispatch({ type: "UPDATE_ACCOUNT", payload: result.data });
      return result.data;
    } catch (error: any) {
      // Безопасное получение сообщения об ошибке
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    }
  }, []);

  const deleteAccount = useCallback(async (id: number) => {
    try {
      await request.delete(`/accounts/${id}`);
      dispatch({ type: "DELETE_ACCOUNT", payload: id });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    }
  }, []);

  const fetchGames = useCallback(async () => {
    dispatch({
      type: "SET_LOADING_FLAG",
      payload: { key: "gamesLoading", value: true },
    });
    try {
      const result = await request.get("/games");
      if (result) {
        dispatch({ type: "SET_GAMES", payload: result.data });
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    } finally {
      dispatch({
        type: "SET_LOADING_FLAG",
        payload: { key: "gamesLoading", value: false },
      });
    }
  }, []);

  const createGame = useCallback(async (data: { name: string }) => {
    try {
      const result = await request.post("/games", data);
      if (result) {
        dispatch({ type: "ADD_GAME", payload: result.data });
        return result.data;
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    }
  }, []);

  const updateGame = useCallback(
    async (id: number, data: Partial<{ name: string }>) => {
      try {
        const result = await request.patch(`/games/${id}`, data);
        if (result) {
          dispatch({ type: "UPDATE_GAME", payload: result.data });
          return result.data;
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR_MESSAGE",
          payload: extractErrorMessage(error),
        });
      }
    },
    []
  );

  const deleteGame = useCallback(async (id: number) => {
    try {
      const result = await request.delete(`/games/${id}`);
      if (result) {
        dispatch({ type: "UPDATE_GAME", payload: result.data });
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    dispatch({
      type: "SET_LOADING_FLAG",
      payload: { key: "ordersLoading", value: true },
    });
    try {
      const result = await request.get("/orders");
      if (result) {
        dispatch({ type: "SET_ORDERS", payload: result.data });
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    } finally {
      dispatch({
        type: "SET_LOADING_FLAG",
        payload: { key: "ordersLoading", value: false },
      });
    }
  }, []);

  const createOrder = useCallback(async (data: CreateOrderDto) => {
    try {
      const result = await request.post("/orders", data);
      if (result) {
        dispatch({ type: "ADD_ORDER", payload: result.data });
        return result.data;
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    }
  }, []);

  const updateOrder = useCallback(
    async (id: number, data: Partial<CreateOrderDto>) => {
      try {
        const result = await request.put(`/orders/${id}`, data);
        if (result) {
          dispatch({ type: "UPDATE_ORDER", payload: result.data });
          return result.data;
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR_MESSAGE",
          payload: extractErrorMessage(error),
        });
      }
    },
    []
  );

  const deleteOrder = useCallback(async (id: number) => {
    try {
      const result = await request.delete(`/orders/${id}`);
      if (result) {
        dispatch({ type: "DELETE_ORDER", payload: id });
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    dispatch({
      type: "SET_LOADING_FLAG",
      payload: { key: "auditLogsLoading", value: true },
    });
    try {
      const result = await request.get("/audit-logs");
      dispatch({ type: "SET_AUDIT_LOGS", payload: result.data });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    } finally {
      dispatch({
        type: "SET_LOADING_FLAG",
        payload: { key: "auditLogsLoading", value: false },
      });
    }
  }, []);

  const fetchPublicAccounts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await request.get("/accounts/public");
      dispatch({ type: "SET_PUBLIC_ACCOUNTS", payload: result.data });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: extractErrorMessage(error),
      });
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR_MESSAGE", payload: "" });
  }, []);

  // ---------------- INIT ----------------

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !state.currentUser) {
      fetchCurrentUser();
    } else if (!token) {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [fetchCurrentUser, state.currentUser]);

  return {
    ...state,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    fetchGames,
    createGame,
    updateGame,
    deleteGame,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    fetchAuditLogs,
    fetchPublicAccounts,
    clearError,
  };
};

// ---------------- PROVIDER ----------------

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
