import React, { useEffect, useMemo, useState } from "react";
import { Order } from "../../types";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Loader } from "../ui-components/loader";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import {
  fetchOrders,
  selectOrders,
  selectOrdersLoading,
} from "@/stores(REDUX)/slices/orders-slice";

export const OrderTable = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const ordersLoading = useAppSelector(selectOrdersLoading);
  const t = useTranslations("orders");
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(orders.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return orders.slice(start, end);
  }, [page, orders, rowsPerPage]);
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length]);

  if (ordersLoading) {
    return <Loader />;
  }

  return (
    <Table
      aria-label="Orders table"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn key="customerName">{t("customerName")}</TableColumn>
        <TableColumn key="phone">{t("phone")}</TableColumn>
        <TableColumn key="status">{t("status")}</TableColumn>
        <TableColumn key="createdAt">{t("createdAt")}</TableColumn>
        <TableColumn key="notes">{t("notes")}</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(items || []).map((order: Order) => (
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
