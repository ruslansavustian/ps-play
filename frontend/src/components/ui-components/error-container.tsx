import { selectAccountsError } from "@/stores(REDUX)/slices/accounts-slice";
import { selectGamesError } from "@/stores(REDUX)/slices/games-slice";
import { AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearError as clearAccountsError } from "@/stores(REDUX)/slices/accounts-slice";
import { clearError as clearGamesError } from "@/stores(REDUX)/slices/games-slice";
import { clearError as clearOrdersError } from "@/stores(REDUX)/slices/orders-slice";
import { clearError as clearUsersError } from "@/stores(REDUX)/slices/users.slice";
import { clearError as clearRolesError } from "@/stores(REDUX)/slices/roles-slice";
import { clearError as clearAuditLogsError } from "@/stores(REDUX)/slices/audit-log.slice";
import { useEffect } from "react";
import { selectOrdersError } from "@/stores(REDUX)/slices/orders-slice";
import { selectUsersError } from "@/stores(REDUX)/slices/users.slice";
import { selectRolesError } from "@/stores(REDUX)/slices/roles-slice";
import { selectAuditLogsError } from "@/stores(REDUX)/slices/audit-log.slice";

export const ErrorContainer = () => {
  const dispatch = useDispatch();
  const accountsError = useSelector(selectAccountsError);
  const gamesError = useSelector(selectGamesError);
  const ordersError = useSelector(selectOrdersError);
  const usersError = useSelector(selectUsersError);
  const rolesError = useSelector(selectRolesError);
  const auditLogsError = useSelector(selectAuditLogsError);

  useEffect(() => {
    if (accountsError) {
      setTimeout(() => {
        dispatch(clearAccountsError());
      }, 1000);
    }
    if (gamesError) {
      setTimeout(() => {
        dispatch(clearGamesError());
      }, 3000);
    }
  }, [accountsError, gamesError, dispatch]);

  useEffect(() => {
    if (ordersError) {
      setTimeout(() => {
        dispatch(clearOrdersError());
      }, 3000);
    }
  }, [ordersError, dispatch]);
  const errors = [
    { type: "accounts", message: accountsError },
    { type: "games", message: gamesError },
    { type: "orders", message: ordersError },
    { type: "users", message: usersError },
    { type: "roles", message: rolesError },
    { type: "auditLogs", message: auditLogsError },
  ].filter((error) => error.message);
  const handleClearError = () => {
    if (accountsError) dispatch(clearAccountsError());
    else if (gamesError) dispatch(clearGamesError());
    else if (ordersError) dispatch(clearOrdersError());
    else if (usersError) dispatch(clearUsersError());
    else if (rolesError) dispatch(clearRolesError());
    else if (auditLogsError) dispatch(clearAuditLogsError());
  };
  if (errors.length === 0) return null;

  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-red-500 p-3 bg-red-50 rounded-xl text-center justify-center text-sm max-w-md mx-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          {error.message}
          <button
            onClick={() => handleClearError()}
            className="ml-2 text-red-600 hover:text-red-800 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
