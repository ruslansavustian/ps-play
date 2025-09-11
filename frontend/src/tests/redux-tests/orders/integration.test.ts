import request from "@/lib/request";
import {
  fetchOrders,
  createOrder,
  clearError,
  addOrder,
  ordersSlice,
} from "@/stores(REDUX)/slices/orders-slice";
import { configureStore } from "@reduxjs/toolkit";
import { CreateOrderDto, Order } from "@/types";

jest.mock("@/lib/request");

const createMockStore = () => {
  return configureStore({
    reducer: {
      orders: ordersSlice.reducer,
    },
  });
};

describe("Orders Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Complete order flow", () => {
    it("should handle complete order creation and fetching flow", async () => {
      const initialOrders: Order[] = [
        {
          id: 1,
          customerName: "Existing Customer",
          phone: "111111111",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      const newOrderDto: CreateOrderDto = {
        customerName: "New Customer",
        phone: "222222222",
        platform: "PS4",
        gameName: "Test Game",
      };

      const createdOrder: Order = {
        id: 2,
        customerName: "New Customer",
        phone: "222222222",
        platform: "PS4",
        gameName: "Test Game",
        status: "pending",
        createdAt: "2024-01-02T00:00:00Z",
      };

      const allOrders: Order[] = [...initialOrders, createdOrder];

      // Mock API responses
      (request.get as jest.Mock).mockResolvedValueOnce({ data: initialOrders });
      (request.post as jest.Mock).mockResolvedValueOnce({ data: createdOrder });
      (request.get as jest.Mock).mockResolvedValueOnce({ data: allOrders });

      const store = createMockStore();

      // 1. Initial fetch
      await store.dispatch(fetchOrders());
      let state = store.getState();
      expect(state.orders.orders).toEqual(initialOrders);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();

      // 2. Create new order
      await store.dispatch(createOrder(newOrderDto));
      state = store.getState();
      expect(state.orders.orders).toContainEqual(createdOrder);
      expect(state.orders.orders).toHaveLength(2);

      // 3. Fetch updated orders
      await store.dispatch(fetchOrders());
      state = store.getState();
      expect(state.orders.orders).toEqual(allOrders);
      expect(state.orders.orders).toHaveLength(2);
    });

    it("should handle error recovery flow", async () => {
      const errorMessage = "Network error";
      const mockOrders: Order[] = [
        {
          id: 1,
          customerName: "Test Customer",
          phone: "123456789",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      // Mock initial error
      (request.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const store = createMockStore();

      // 1. Initial fetch fails
      await store.dispatch(fetchOrders());
      let state = store.getState();
      expect(state.orders.error).toBe(errorMessage);
      expect(state.orders.loading).toBe(false);

      // 2. Clear error
      store.dispatch(clearError());
      state = store.getState();
      expect(state.orders.error).toBeNull();

      // 3. Retry fetch succeeds
      (request.get as jest.Mock).mockResolvedValueOnce({ data: mockOrders });
      await store.dispatch(fetchOrders());
      state = store.getState();
      expect(state.orders.orders).toEqual(mockOrders);
      expect(state.orders.error).toBeNull();
    });
  });

  describe("Mixed actions flow", () => {
    it("should handle mixed sync and async actions", async () => {
      const mockOrders: Order[] = [
        {
          id: 1,
          customerName: "API Order",
          phone: "111111111",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      const localOrder: Order = {
        id: 2,
        customerName: "Local Order",
        phone: "222222222",
        platform: "PS4",
        status: "pending",
        createdAt: "2024-01-02T00:00:00Z",
      };

      (request.get as jest.Mock).mockResolvedValueOnce({ data: mockOrders });

      const store = createMockStore();

      // 1. Fetch orders from API
      await store.dispatch(fetchOrders());
      let state = store.getState();
      expect(state.orders.orders).toEqual(mockOrders);

      // 2. Add local order
      store.dispatch(addOrder(localOrder));
      state = store.getState();
      expect(state.orders.orders).toHaveLength(2);
      expect(state.orders.orders).toContainEqual(localOrder);

      // 3. Clear any errors
      store.dispatch(clearError());
      state = store.getState();
      expect(state.orders.error).toBeNull();
    });
  });

  describe("Concurrent operations", () => {
    it("should handle concurrent fetch and create operations", async () => {
      const initialOrders: Order[] = [
        {
          id: 1,
          customerName: "Initial Order",
          phone: "111111111",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      const newOrderDto: CreateOrderDto = {
        customerName: "Concurrent Order",
        phone: "222222222",
        platform: "PS4",
      };

      const createdOrder: Order = {
        id: 2,
        customerName: "Concurrent Order",
        phone: "222222222",
        platform: "PS4",
        status: "pending",
        createdAt: "2024-01-02T00:00:00Z",
      };

      // Mock API responses
      (request.get as jest.Mock).mockResolvedValueOnce({ data: initialOrders });
      (request.post as jest.Mock).mockResolvedValueOnce({ data: createdOrder });

      const store = createMockStore();

      // Start both operations concurrently
      const fetchPromise = store.dispatch(fetchOrders());
      const createPromise = store.dispatch(createOrder(newOrderDto));

      // Wait for both to complete
      await Promise.all([fetchPromise, createPromise]);

      const state = store.getState();
      expect(state.orders.orders).toContainEqual(initialOrders[0]);
      expect(state.orders.orders).toContainEqual(createdOrder);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });
  });
});
