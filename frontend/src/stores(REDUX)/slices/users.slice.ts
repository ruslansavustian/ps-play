import request from "@/lib/request";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersState } from "../types";
import { RootState } from "../index";
import { UpdateUser, User } from "@/types";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get<User[]>("/users");

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",

  async (
    { id, data }: { id: number; data: UpdateUser },
    { rejectWithValue }
  ) => {
    try {
      const response = await request.patch(`/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async (
    { id, roleId }: { id: number; roleId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await request.put(`/users/${id}/role`, { roleId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  }
);

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user: User) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user: User) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUsers } = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;

export default usersSlice.reducer;
