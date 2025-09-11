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

describe("Orders Edge Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("API Response Edge Cases", () => {
    it("should handle empty API response", async () => {
      (request.get as jest.Mock).mockResolvedValueOnce({ data: [] });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toEqual([]);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });

    it("should handle null API response", async () => {
      (request.get as jest.Mock).mockResolvedValueOnce({ data: null });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toBeNull();
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });

    it("should handle undefined API response", async () => {
      (request.get as jest.Mock).mockResolvedValueOnce({ data: undefined });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toBeUndefined();
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });

    it("should handle malformed API response", async () => {
      (request.get as jest.Mock).mockResolvedValueOnce({
        data: "invalid data",
      });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toBe("invalid data");
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });
  });

  describe("Error Edge Cases", () => {
    it("should handle error without response object", async () => {
      (request.get as jest.Mock).mockRejectedValueOnce(
        new Error("Network failed")
      );

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.error).toBe("Failed to fetch games");
      expect(state.orders.loading).toBe(false);
    });

    it("should handle error with empty response", async () => {
      (request.get as jest.Mock).mockRejectedValueOnce({
        response: {},
      });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.error).toBe("Failed to fetch games");
      expect(state.orders.loading).toBe(false);
    });

    it("should handle error with response but no data", async () => {
      (request.get as jest.Mock).mockRejectedValueOnce({
        response: { data: {} },
      });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.error).toBe("Failed to fetch games");
      expect(state.orders.loading).toBe(false);
    });

    it("should handle error with response.data but no message", async () => {
      (request.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { error: "Some error" } },
      });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.error).toBe("Failed to fetch games");
      expect(state.orders.loading).toBe(false);
    });
  });

  describe("Data Edge Cases", () => {
    it("should handle orders with missing optional fields", async () => {
      const ordersWithMissingFields: Order[] = [
        {
          id: 1,
          // missing customerName, phone, platform, etc.
        } as Order,
        {
          id: 2,
          customerName: "Complete Order",
          phone: "123456789",
          platform: "PS5",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      (request.get as jest.Mock).mockResolvedValueOnce({
        data: ordersWithMissingFields,
      });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toEqual(ordersWithMissingFields);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });

    it("should handle very large orders array", async () => {
      const largeOrdersArray: Order[] = Array.from(
        { length: 1000 },
        (_, index) => ({
          id: index + 1,
          customerName: `Customer ${index + 1}`,
          phone: `123456${index.toString().padStart(3, "0")}`,
          platform: index % 2 === 0 ? "PS5" : "PS4",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        })
      );

      (request.get as jest.Mock).mockResolvedValueOnce({
        data: largeOrdersArray,
      });

      const store = createMockStore();
      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toHaveLength(1000);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });
  });

  describe("Create Order Edge Cases", () => {
    it("should handle create order with minimal data", async () => {
      const minimalOrderDto: CreateOrderDto = {
        customerName: "Minimal Order",
      };

      const createdOrder: Order = {
        id: 1,
        customerName: "Minimal Order",
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
      };

      (request.post as jest.Mock).mockResolvedValueOnce({ data: createdOrder });

      const store = createMockStore();
      await store.dispatch(createOrder(minimalOrderDto));

      const state = store.getState();
      expect(state.orders.orders).toContainEqual(createdOrder);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });

    it("should handle create order with all fields", async () => {
      const completeOrderDto: CreateOrderDto = {
        customerName: "Complete Order",
        phone: "123456789",
        gameName: "Test Game",
        platform: "PS5",
        notes: "Special instructions",
        email: "test@example.com",
        telegram: "@testuser",
        accountId: 1,
        purchaseType: "rental",
      };

      const createdOrder: Order = {
        id: 1,
        ...completeOrderDto,
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
      };

      (request.post as jest.Mock).mockResolvedValueOnce({ data: createdOrder });

      const store = createMockStore();
      await store.dispatch(createOrder(completeOrderDto));

      const state = store.getState();
      expect(state.orders.orders).toContainEqual(createdOrder);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });

    it("should handle create order with empty string values", async () => {
      const orderWithEmptyStrings: CreateOrderDto = {
        customerName: "",
        phone: "",
        platform: "",
        gameName: "",
        notes: "",
        email: "",
        telegram: "",
      };

      const createdOrder: Order = {
        id: 1,
        ...orderWithEmptyStrings,
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
      };

      (request.post as jest.Mock).mockResolvedValueOnce({ data: createdOrder });

      const store = createMockStore();
      await store.dispatch(createOrder(orderWithEmptyStrings));

      const state = store.getState();
      expect(state.orders.orders).toContainEqual(createdOrder);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });
  });

  describe("State Edge Cases", () => {
    it("should handle rapid successive dispatches", async () => {
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

      (request.get as jest.Mock).mockResolvedValue({ data: mockOrders });

      const store = createMockStore();

      // Dispatch multiple times rapidly
      const promises = [
        store.dispatch(fetchOrders()),
        store.dispatch(fetchOrders()),
        store.dispatch(fetchOrders()),
      ];

      await Promise.all(promises);

      const state = store.getState();
      expect(state.orders.orders).toEqual(mockOrders);
      expect(state.orders.loading).toBe(false);
      expect(state.orders.error).toBeNull();
    });

    it("should handle state with existing orders when fetching", async () => {
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

      const newOrders: Order[] = [
        {
          id: 2,
          customerName: "New Order",
          phone: "222222222",
          platform: "PS4",
          status: "pending",
          createdAt: "2024-01-02T00:00:00Z",
        },
      ];

      // Set up store with existing orders
      const store = createMockStore();
      store.dispatch({
        type: "orders/setOrders",
        payload: existingOrders,
      });

      (request.get as jest.Mock).mockResolvedValueOnce({ data: newOrders });

      await store.dispatch(fetchOrders());

      const state = store.getState();
      expect(state.orders.orders).toEqual(newOrders);
      expect(state.orders.orders).not.toContainEqual(existingOrders[0]);
    });
  });
});
