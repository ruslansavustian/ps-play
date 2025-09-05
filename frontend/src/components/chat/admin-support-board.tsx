"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "../../hooks/use-chat";
import { ChatMessage } from "@/types";

interface SupportTicket {
  id: string;
  userName: string;
  message: string;
  status: "open" | "closed";
}

export function AdminSupportBoard() {
  const {
    messages,
    isConnected,
    userName,
    tickets,
    selectedTicket,
    socket,
    joinAsAdmin,
    joinTicket,
    sendMessage,
    sendAdminMessage,
    clearMessages,
    connectSocket,
    setMessages,
  } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  const [isAdminConnected, setIsAdminConnected] = useState(false);
  const [disconnectedUsers, setDisconnectedUsers] = useState<Set<string>>(
    new Set()
  );
  const [disconnectedUserNames, setDisconnectedUserNames] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  useEffect(() => {
    if (!isAdminConnected && isConnected) {
      joinAsAdmin();
      setIsAdminConnected(true);
    }
  }, [joinAsAdmin, isAdminConnected, isConnected]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "userDisconnected",
        (data: { ticketId: string; userName: string; userId: string }) => {
          setDisconnectedUsers((prev) => new Set(prev).add(data.userId));
          setDisconnectedUserNames((prev) => new Set(prev).add(data.userName));

          if (selectedTicket === data.ticketId) {
            const systemMessage = {
              id: Date.now(),
              message: `Пользователь ${data.userName} отключился от чата`,
              userName: "System",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, systemMessage]);
          }
        }
      );

      socket.on(
        "userReconnected",
        (data: { ticketId: string; userName: string; userId: string }) => {
          setDisconnectedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
          setDisconnectedUserNames((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.userName);
            return newSet;
          });

          if (selectedTicket === data.ticketId) {
            const systemMessage = {
              id: Date.now(),
              message: `Пользователь ${data.userName} снова подключился к чату`,
              userName: "System",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, systemMessage]);
          }
        }
      );
    }
  }, [socket, selectedTicket]);

  const handleJoinTicket = (ticketId: string) => {
    joinTicket(ticketId);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedTicket) {
      sendAdminMessage(inputMessage, selectedTicket);
      setInputMessage("");
    }
  };

  const handleCloseTicket = (ticketId: string) => {
    // TODO: implement
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Панель поддержки
      </h2>

      <div className="flex gap-4 h-96">
        <div className="w-1/3 border-r pr-4">
          <h3 className="text-lg font-semibold mb-4">Тикеты поддержки</h3>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {!tickets || tickets.length === 0 ? (
              <p className="text-gray-500 text-sm">Нет активных тикетов</p>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedTicket === ticket.id
                      ? "bg-blue-100 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => handleJoinTicket(ticket.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {ticket.userName}
                        <div
                          className={`w-2 h-2 rounded-full ${
                            disconnectedUserNames.has(ticket.userName)
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          title={
                            disconnectedUserNames.has(ticket.userName)
                              ? "Пользователь отключен"
                              : "Пользователь онлайн"
                          }
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {ticket.message}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          ticket.status === "open"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ticket.status === "open" ? "Открыт" : "Закрыт"}
                      </span>
                      {ticket.status === "open" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseTicket(ticket.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedTicket ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 border rounded-lg mb-4">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center">Нет сообщений</p>
                ) : (
                  messages.map((msg: ChatMessage) => (
                    <div
                      key={msg.id || Math.random()}
                      className={`flex ${
                        msg.userName === userName
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded-lg ${
                          msg.userName === userName
                            ? "bg-blue-600 text-white"
                            : msg.userName === "System"
                            ? "bg-yellow-100 text-yellow-800 text-center w-full"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="text-xs opacity-70 mb-1">
                          {msg.userName}
                        </div>
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(
                            msg.createdAt || msg.timestamp || Date.now()
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Введите ответ..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Отправить
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Выберите тикет для начала чата
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm text-gray-600">
          {isConnected ? "Подключено к серверу" : "Отключено от сервера"}
        </span>
      </div>
    </div>
  );
}
