import { Account } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Checkbox,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { AccountDetailModal } from "../modals/account-detail-modal";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import {
  selectAccounts,
  selectAccountsLoading,
} from "@/stores(REDUX)/slices/accounts-slice";
import { fetchAccounts } from "@/stores(REDUX)/slices/accounts-slice";
import { fetchGames, selectGames } from "@/stores(REDUX)/slices/games-slice";
import { Loader } from "../ui-components/loader";

// Accounts List Component
export const AccountTable = () => {
  const dispatch = useAppDispatch();
  const games = useAppSelector(selectGames);
  const accounts = useAppSelector(selectAccounts);
  const accountsLoading = useAppSelector(selectAccountsLoading);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations();

  const handleRowClick = useCallback(
    (account: Account) => {
      setSelectedAccount(account);
      onOpen();
    },
    [onOpen]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedAccount(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (accounts.length === 0) {
      dispatch(fetchAccounts());
    }
  }, [dispatch, accounts.length]);

  useEffect(() => {
    if (games.length === 0) {
      dispatch(fetchGames());
    }
  }, [dispatch, games.length]);

  if (accountsLoading && accounts.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Игровые аккаунты</h1>
          <div className=" text-gray-600">
            {accounts?.length || 0} аккаунтов найдено
          </div>
        </div>
        {selectedAccount?.id && (
          <AccountDetailModal
            isOpen={isOpen}
            onClose={handleCloseModal}
            setSelectedAccount={setSelectedAccount}
            selectedAccount={selectedAccount!}
          />
        )}
        {/* Table */}
        <Table
          aria-label="Gaming accounts table"
          selectionMode="none"
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="id" allowsSorting>
              ID
            </TableColumn>
            <TableColumn key="email">{t("accounts.email")}</TableColumn>
            <TableColumn key="platform">{t("accounts.games")}</TableColumn>

            <TableColumn key="p1">P1</TableColumn>
            <TableColumn key="p2PS4">P2PS4</TableColumn>
            <TableColumn key="p2PS5">P2PS5</TableColumn>
            <TableColumn key="p3">P3</TableColumn>
            <TableColumn key="p3A">P3A</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">
                  Аккаунты не найдены
                </div>
                <div className="text-gray-400 ">
                  Пока нет доступных игровых аккаунтов.
                </div>
              </div>
            }
          >
            {(accounts || []).map((account) => (
              <TableRow
                key={account.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(account)}
              >
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {account.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {account?.email ? account.email : "-"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flew-row">
                    {account.games?.map((game) => (
                      <p key={game.id}>{game.name}/</p>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <Checkbox isSelected={account.P1} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P2PS4} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P2PS5} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P3} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P3A} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
