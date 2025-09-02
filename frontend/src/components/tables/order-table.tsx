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
import { useTranslations } from "next-intl";

export const OrderTable = () => {
  const { orders, fetchOrders, ordersLoading } = useApp();
  const t = useTranslations("orders");

  if (ordersLoading) {
    return <Loader />;
  }

  return (
    <Table aria-label="Orders table">
      <TableHeader>
        <TableColumn key="customerName">{t("customerName")}</TableColumn>
        <TableColumn key="phone">{t("phone")}</TableColumn>
        <TableColumn key="status">{t("status")}</TableColumn>
        <TableColumn key="createdAt">{t("createdAt")}</TableColumn>
        <TableColumn key="notes">{t("notes")}</TableColumn>
      </TableHeader>
      <TableBody>
        {(orders || []).map((order: Order) => (
          <TableRow key={order.id}>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{order.phone}</TableCell>
            <TableCell>{order.status}</TableCell>
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
