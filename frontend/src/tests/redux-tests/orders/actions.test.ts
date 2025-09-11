import {
  clearError,
  setOrders,
  addOrder,
  ordersSlice,
} from "@/stores(REDUX)/slices/orders-slice";
import { Order } from "@/types";

describe("Orders Actions", () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null,
  };

  describe("clearError", () => {
    it("should clear error when error exists", () => {
      const stateWithError = {
        ...initialState,
        error: "Some error message",
      };

      const action = clearError();
      const newState = ordersSlice.reducer(stateWithError, action);

      expect(newState.error).toBeNull();
    });

    it("should not change state when no error exists", () => {
      const action = clearError();
      const newState = ordersSlice.reducer(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe("setOrders", () => {
    it("should set orders array", () => {
      const mockOrders: Order[] = [
        {
          id: 1,
          customerName: "John Doe",
          phone: "123456789",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          customerName: "Jane Smith",
          phone: "987654321",
          platform: "PS4",
          status: "completed",
          createdAt: "2024-01-02T00:00:00Z",
        },
      ];

      const action = setOrders(mockOrders);
      const newState = ordersSlice.reducer(initialState, action);

      expect(newState.orders).toEqual(mockOrders);
      expect(newState.orders).toHaveLength(2);
    });

    it("should replace existing orders", () => {
      const existingOrders: Order[] = [
        {
          id: 1,
          customerName: "Old Order",
          phone: "111111111",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      const newOrders: Order[] = [
        {
          id: 2,
          customerName: "New Order",
          phone: "222222222",
          platform: "PS4",
          status: "completed",
          createdAt: "2024-01-02T00:00:00Z",
        },
      ];

      const stateWithOrders = {
        ...initialState,
        orders: existingOrders,
      };

      const action = setOrders(newOrders);
      const newState = ordersSlice.reducer(stateWithOrders, action);

      expect(newState.orders).toEqual(newOrders);
      expect(newState.orders).toHaveLength(1);
      expect(newState.orders[0].id).toBe(2);
    });

    it("should handle empty orders array", () => {
      const action = setOrders([]);
      const newState = ordersSlice.reducer(initialState, action);

      expect(newState.orders).toEqual([]);
      expect(newState.orders).toHaveLength(0);
    });
  });

  describe("addOrder", () => {
    it("should add order to existing orders", () => {
      const existingOrders: Order[] = [
        {
          id: 1,
          customerName: "Existing Order",
          phone: "111111111",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      const newOrder: Order = {
        id: 2,
        customerName: "New Order",
        phone: "222222222",
        platform: "PS4",
        status: "completed",
        createdAt: "2024-01-02T00:00:00Z",
      };

      const stateWithOrders = {
        ...initialState,
        orders: existingOrders,
      };

      const action = addOrder(newOrder);
      const newState = ordersSlice.reducer(stateWithOrders, action);

      expect(newState.orders).toHaveLength(2);
      expect(newState.orders).toContainEqual(newOrder);
      expect(newState.orders[1]).toEqual(newOrder);
    });

    it("should add order to empty orders array", () => {
      const newOrder: Order = {
        id: 1,
        customerName: "First Order",
        phone: "123456789",
        platform: "PS5",
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const action = addOrder(newOrder);
      const newState = ordersSlice.reducer(initialState, action);

      expect(newState.orders).toHaveLength(1);
      expect(newState.orders[0]).toEqual(newOrder);
    });
  });
});
