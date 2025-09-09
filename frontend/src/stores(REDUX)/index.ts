import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import accountsReducer from "./slices/accounts-slice";

import gamesReducer from "./slices/games-slice";
import auditLogsSlice from "./slices/audit-log.slice";
import ordersReducer from "./slices/orders-slice";
import usersReducer from "./slices/users.slice";
import authReducer from "./slices/auth-slice";
export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    games: gamesReducer,
    auditLogs: auditLogsSlice,
    orders: ordersReducer,
    users: usersReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools:
    process.env.NODE_ENV !== "production"
      ? {
          name: "PS Play Store",
          trace: true,
          traceLimit: 25,
          // Настройки для лучшего отображения
          maxAge: 50, // Максимум действий в истории
          shouldHotReload: false, // Отключить hot reload для стабильности
          shouldRecordChanges: true, // Записывать изменения
          shouldStartLocked: false, // Не блокировать по умолчанию
        }
      : false,
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Экспорт store для использования в приложении
export default store;
