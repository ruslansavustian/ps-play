import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginDto, User } from "@/types";
import request from "@/lib/request";
import { RootState, AppDispatch } from "..";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get("/auth/profile");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch current user"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (loginDto: LoginDto, { rejectWithValue }) => {
    try {
      const sessionResponse = await request.post("/auth/init-session");
      const { uuid } = sessionResponse.data;
      const credentials = btoa(`${loginDto.email}:${loginDto.password}`);
      const response = await request.post(
        "/auth/login",
        { uuid },
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );
      if (response) {
        const { access_token, user } = response.data;
        localStorage.setItem("token", access_token);
        request.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return user;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to login"
      );
    }
  }
);

// Синхронное действие для logout
export const logout = () => (dispatch: AppDispatch) => {
  // Очищаем localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  // Очищаем заголовки axios
  request.defaults.headers.common["Authorization"] = "";

  // Диспатчим action для очистки состояния
  dispatch(logoutAction());
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser, logout: logoutAction } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectLoading = (state: RootState) => state.auth.loading;

export default authSlice.reducer;
