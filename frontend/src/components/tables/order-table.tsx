import React from "react";

import { Order } from "../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useApp } from "@/contexts/AppProvider";
import { Loader } from "../ui-components/loader";
import moment from "moment";

export const OrderTable = () => {
  const { orders, fetchOrders, ordersLoading } = useApp();

  if (ordersLoading) {
    return <Loader />;
  }

  return (
    <Table aria-label="Orders table">
      <TableHeader>
        <TableColumn key="customerName">Имя</TableColumn>
        <TableColumn key="phone">Телефон</TableColumn>
        <TableColumn key="gameName">Игры</TableColumn>
        <TableColumn key="platform">Платаформа</TableColumn>
        <TableColumn key="createdAt">Дата</TableColumn>
        <TableColumn key="notes">Примечания</TableColumn>
      </TableHeader>
      <TableBody>
        {(orders || []).map((order: Order) => (
          <TableRow key={order.id}>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{order.phone}</TableCell>
            <TableCell>{order.gameName}</TableCell>
            <TableCell>{order.platform}</TableCell>
            <TableCell>
              {moment(order.createdAt).format("DD.MM.YYYY HH:mm")}
            </TableCell>
            <TableCell>{order.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
