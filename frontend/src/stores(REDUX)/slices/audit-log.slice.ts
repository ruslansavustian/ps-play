import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuditLogsState } from "../types";
import request from "@/lib/request";
import { RootState } from "../index";

export const fetchAuditLogs = createAsyncThunk(
  "auditLogs/fetchAuditLogs",
  async () => {
    const response = await request.get("/audit-logs");
    return response.data;
  }
);
const initialState: AuditLogsState = {
  auditLogs: [],
  loading: false,
  error: null,
};

export const auditLogsSlice = createSlice({
  name: "auditLogs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuditLogs: (state, action) => {
      state.auditLogs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload;
        state.error = null;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setAuditLogs } = auditLogsSlice.actions;

export const selectAuditLogs = (state: RootState) => state.auditLogs.auditLogs;
export const selectAuditLogsLoading = (state: RootState) =>
  state.auditLogs.loading;
export const selectAuditLogsError = (state: RootState) => state.auditLogs.error;

export default auditLogsSlice.reducer;
