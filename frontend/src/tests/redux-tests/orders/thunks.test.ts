import request from "@/lib/request";
import {
  fetchOrders,
  createOrder,
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

describe("Orders Thunks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchOrders", () => {
    it("should handle successful fetch", async () => {
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

      (request.get as jest.Mock).mockResolvedValueOnce({ data: mockOrders });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toEqual(mockOrders);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
      expect(request.get).toHaveBeenCalledWith("/orders");
    });

    it("should handle fetch error with response", async () => {
      const errorMessage = "Network error";
      (request.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBe(errorMessage);
      expect(state.orders.orders).toEqual([]);
    });

    it("should handle fetch error without response", async () => {
      (request.get as jest.Mock).mockRejectedValueOnce(
        new Error("Network failed")
      );

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBe("Failed to fetch games");
      expect(state.orders.orders).toEqual([]);
    });

    it("should set loading state during fetch", async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      (request.get as jest.Mock).mockReturnValueOnce(promise);

      const store = createMockStore();
      const dispatchPromise = store.dispatch(fetchOrders());

      // Check loading state
      let state = store.getState();
      expect(state.orders.loading).toBe(true);
      expect(state.orders.error).toBeNull();

      // Resolve the promise
      resolvePromise!({ data: [] });
      await dispatchPromise;

      // Check final state
      state = store.getState();
      expect(state.orders.loading).toBe(false);
    });
  });

  describe("createOrder", () => {
    it("should handle successful order creation", async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: "New Customer",
        phone: "555555555",
        platform: "PS5",
        gameName: "Test Game",
      };

      const createdOrder: Order = {
        id: 3,
        customerName: "New Customer",
        phone: "555555555",
        platform: "PS5",
        gameName: "Test Game",
        status: "pending",
        createdAt: "2024-01-03T00:00:00Z",
      };

      (request.post as jest.Mock).mockResolvedValueOnce({ data: createdOrder });

      const store = createMockStore();
      await store.dispatch(createOrder(createOrderDto));

      const state = store.getState();
      expect(state.orders.orders).toContainEqual(createdOrder);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
      expect(request.post).toHaveBeenCalledWith("/orders", createOrderDto);
    });

    it("should handle order creation error with response", async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: "New Customer",
        phone: "555555555",
        platform: "PS5",
      };

      const errorMessage = "Validation failed";
      (request.post as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const store = createMockStore();
      await store.dispatch(createOrder(createOrderDto));

      const state = store.getState();
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBe(errorMessage);
      expect(state.orders.orders).toEqual([]);
    });

    it("should handle order creation error without response", async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: "New Customer",
        phone: "555555555",
        platform: "PS5",
      };

      (request.post as jest.Mock).mockRejectedValueOnce(
        new Error("Network failed")
      );

      const store = createMockStore();
      await store.dispatch(createOrder(createOrderDto));

      const state = store.getState();
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBe("Failed to create order");
      expect(state.orders.orders).toEqual([]);
    });

    it("should set loading state during order creation", async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: "New Customer",
        phone: "555555555",
        platform: "PS5",
      };

      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      (request.post as jest.Mock).mockReturnValueOnce(promise);

      const store = createMockStore();
      const dispatchPromise = store.dispatch(createOrder(createOrderDto));

      // Check loading state
      let state = store.getState();
      expect(state.orders.loading).toBe(true);
      expect(state.orders.error).toBeNull();

      // Resolve the promise
      resolvePromise!({ data: { id: 1, ...createOrderDto } });
      await dispatchPromise;

      // Check final state
      state = store.getState();
      expect(state.orders.loading).toBe(false);
    });
  });
});
