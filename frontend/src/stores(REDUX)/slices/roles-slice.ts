import request from "@/lib/request";
import { Role } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { RolesState } from "../types";

export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get<Role[]>("/roles");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch roles"
      );
    }
  }
);

const initialState: RolesState = {
  roles: [],
  loading: false,
  error: null,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    updateRoleInState: (state, action: PayloadAction<Role>) => {
      state.roles = state.roles.map((role: Role) =>
        role.id === action.payload.id ? action.payload : role
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setRoles } = rolesSlice.actions;
export const selectRoles = (state: RootState) => state.roles.roles;
export const selectRolesLoading = (state: RootState) => state.roles.loading;
export const selectRolesError = (state: RootState) => state.roles.error;

export default rolesSlice.reducer;
