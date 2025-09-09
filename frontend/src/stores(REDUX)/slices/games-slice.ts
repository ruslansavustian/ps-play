import request from "@/lib/request";
import { Game } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GamesState } from "../types";
import { RootState } from "../index";

export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get<Game[]>("/games");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch games"
      );
    }
  }
);

export const createGame = createAsyncThunk(
  "games/createGame",
  async (game: Partial<Game>, { rejectWithValue }) => {
    try {
      const response = await request.post<Game>("/games", game);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create game"
      );
    }
  }
);
export const updateGame = createAsyncThunk(
  "games/updateGame",
  async (
    { id, data }: { id: number; data: Partial<Game> },
    { rejectWithValue }
  ) => {
    try {
      const response = await request.patch<Game>(`/games/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update game"
      );
    }
  }
);

const initialState: GamesState = {
  games: [],
  currentGame: null,
  loading: false,
  error: null,
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    },
    setCurrentGame: (state, action: PayloadAction<Game>) => {
      state.currentGame = action.payload;
    },
    addGame: (state, action: PayloadAction<Game>) => {
      state.games.push(action.payload);
    },
    updateGameInState: (state, action: PayloadAction<Game>) => {
      state.games = state.games.map((game) =>
        game.id === action.payload.id ? action.payload : game
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.loading = false;
        state.games.push(action.payload);
        state.error = null;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.loading = false;
        state.games = state.games.map((game) =>
          game.id === action.payload.id ? action.payload : game
        );
        state.error = null;
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setGames,
  setCurrentGame,
  addGame,
  updateGameInState,
  //   removeGame,
} = gamesSlice.actions;

export const selectGames = (state: RootState) => state.games.games;
export const selectCurrentGame = (state: RootState) => state.games.currentGame;
export const selectGamesLoading = (state: RootState) => state.games.loading;
export const selectGamesError = (state: RootState) => state.games.error;

export default gamesSlice.reducer;
