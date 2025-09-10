import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AccountsState } from "../types";
import { Account } from "@/types";
import { RootState } from "../index";
import request from "@/lib/request";

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get<Account[]>("/accounts");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch accounts"
      );
    }
  }
);

export const fetchPublicAccounts = createAsyncThunk(
  "accounts/fetchPublicAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get<Account[]>("/accounts/public");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch public accounts"
      );
    }
  }
);

export const createAccount = createAsyncThunk(
  "accounts/createAccount",
  async (accountData: Partial<Account>, { rejectWithValue }) => {
    try {
      const response = await request.post<Account>("/accounts", accountData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create account"
      );
    }
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async (
    { id, data }: { id: number; data: Partial<Account> },
    { rejectWithValue }
  ) => {
    try {
      const response = await request.patch<Account>(`/accounts/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update account"
      );
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id: number, { rejectWithValue }) => {
    try {
      await request.delete(`/accounts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  }
);

// Начальное состояние
const initialState: AccountsState = {
  accounts: [],
  publicAccounts: [],
  loading: false,
  publicAccountsLoading: false,
  error: null,
  publicAccountsError: null,
};

// Slice (модуль состояния)
const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    // Синхронные действия
    clearError: (state) => {
      state.error = null;
    },
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    setPublicAccounts: (state, action: PayloadAction<Account[]>) => {
      state.publicAccounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    updateAccountInState: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(
        (account) => account.id === action.payload.id
      );
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    removeAccount: (state, action: PayloadAction<number>) => {
      state.accounts = state.accounts.filter(
        (account) => account.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
        state.error = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Public Accounts
      .addCase(fetchPublicAccounts.pending, (state) => {
        state.publicAccountsLoading = true;
        state.publicAccountsError = null;
      })
      .addCase(fetchPublicAccounts.fulfilled, (state, action) => {
        state.publicAccountsLoading = false;
        state.publicAccounts = action.payload;
        state.publicAccountsError = null;
      })
      .addCase(fetchPublicAccounts.rejected, (state, action) => {
        state.publicAccountsLoading = false;

        state.publicAccountsError = action.payload as string;
      })
      // Create Account
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload);
        state.error = null;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Account
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          (account) => account.id === action.payload.id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter(
          (account) => account.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setAccounts,
  addAccount,
  updateAccountInState,
  removeAccount,
  setPublicAccounts,
} = accountsSlice.actions;

export const selectAccounts = (state: RootState) => state.accounts.accounts;
export const selectPublicAccountsLoading = (state: RootState) =>
  state.accounts.publicAccountsLoading;

export const selectPublicAccounts = (state: RootState) =>
  state.accounts.publicAccounts;
export const selectAccountsLoading = (state: RootState) =>
  state.accounts.loading;
export const selectAccountsError = (state: RootState) => state.accounts.error;
export const selectPublicAccountsError = (state: RootState) =>
  state.accounts.publicAccountsError;

export default accountsSlice.reducer;
