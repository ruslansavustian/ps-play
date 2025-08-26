import React, { useState } from "react";
import { OrderTable } from "../tables/order-table";
import { MyButton } from "../ui-components/my-button";
import { useApp } from "@/contexts/AppProvider";
import { CreateOrderModal } from "../modals/create-order-modal";

export const OrderSection = () => {
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

  return (
    <div>
      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
      />
      <div className="flex justify-end">
        <MyButton
          title="+ Добавить заказ"
          onClick={() => setIsCreateOrderModalOpen(true)}
        />
      </div>
      <OrderTable />
    </div>
  );
};
