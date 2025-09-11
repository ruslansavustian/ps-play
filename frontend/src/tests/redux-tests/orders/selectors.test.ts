import {
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
} from "@/stores(REDUX)/slices/orders-slice";
import { Order } from "@/types";

describe("Orders Selectors", () => {
  const mockOrder: Order = {
    id: 1,
    customerName: "Test Customer",
    phone: "123456789",
    platform: "PS5",
    status: "pending",
    createdAt: "2024-01-01T00:00:00Z",
  };

  describe("selectOrders", () => {
    it("should return orders array", () => {
      const state = {
        orders: {
          orders: [mockOrder],
          loading: false,
          error: null,
        },
      };

      const result = selectOrders(state as any);
      expect(result).toEqual([mockOrder]);
    });

    it("should return empty array when no orders", () => {
      const state = {
        orders: {
          orders: [],
          loading: false,
          error: null,
        },
      };

      const result = selectOrders(state as any);
      expect(result).toEqual([]);
    });

    it("should return multiple orders", () => {
      const orders: Order[] = [
        mockOrder,
        {
          id: 2,
          customerName: "Another Customer",
          phone: "987654321",
          platform: "PS4",
          status: "completed",
          createdAt: "2024-01-02T00:00:00Z",
        },
      ];

      const state = {
        orders: {
          orders,
          loading: false,
          error: null,
        },
      };

      const result = selectOrders(state as any);
      expect(result).toEqual(orders);
      expect(result).toHaveLength(2);
    });
  });

  describe("selectOrdersLoading", () => {
    it("should return true when loading", () => {
      const state = {
        orders: {
          orders: [],
          loading: true,
          error: null,
        },
      };

      const result = selectOrdersLoading(state as any);
      expect(result).toBe(true);
    });

    it("should return false when not loading", () => {
      const state = {
        orders: {
          orders: [],
          loading: false,
          error: null,
        },
      };

      const result = selectOrdersLoading(state as any);
      expect(result).toBe(false);
    });
  });

  describe("selectOrdersError", () => {
    it("should return error message when error exists", () => {
      const errorMessage = "Something went wrong";
      const state = {
        orders: {
          orders: [],
          loading: false,
          error: errorMessage,
        },
      };

      const result = selectOrdersError(state as any);
      expect(result).toBe(errorMessage);
    });

    it("should return null when no error", () => {
      const state = {
        orders: {
          orders: [],
          loading: false,
          error: null,
        },
      };

      const result = selectOrdersError(state as any);
      expect(result).toBeNull();
    });

    it("should return empty string when error is empty string", () => {
      const state = {
        orders: {
          orders: [],
          loading: false,
          error: "",
        },
      };

      const result = selectOrdersError(state as any);
      expect(result).toBe("");
    });
  });

  describe("Selector integration", () => {
    it("should work together to provide complete state", () => {
      const orders: Order[] = [mockOrder];
      const loading = true;
      const error = "Test error";

      const state = {
        orders: {
          orders,
          loading,
          error,
        },
      };

      expect(selectOrders(state as any)).toEqual(orders);
      expect(selectOrdersLoading(state as any)).toBe(loading);
      expect(selectOrdersError(state as any)).toBe(error);
    });

    it("should handle undefined state gracefully", () => {
      const state = {
        orders: undefined,
      };

      expect(() => selectOrders(state as any)).toThrow();
      expect(() => selectOrdersLoading(state as any)).toThrow();
      expect(() => selectOrdersError(state as any)).toThrow();
    });
  });
});
