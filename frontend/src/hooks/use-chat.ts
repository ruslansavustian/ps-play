import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage } from "@/types";

export const useChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
    console.log("🔌 [HOOK] Connecting to WebSocket:", wsUrl);
    const newSocket = io(wsUrl);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("🔌 [HOOK] Connected to support server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("🔌 [HOOK] Disconnected from support server");
    });

    newSocket.on("newSupportTicket", (ticket: any) => {
      console.log("🎫 [HOOK] New support ticket:", ticket);
      setTickets((prev) => [...prev, ticket]);
    });

    newSocket.on("supportTicketsList", (ticketsList: any[]) => {
      console.log("🎫 [HOOK] Received tickets list:", ticketsList);
      setTickets(ticketsList);
    });

    newSocket.on(
      "userDisconnected",
      (data: { ticketId: string; userName: string; userId: string }) => {
        console.log("🔌 [HOOK] User disconnected from support:", data);
        // Можно добавить уведомление или обновление статуса тикета
      }
    );

    newSocket.on(
      "userReconnected",
      (data: { ticketId: string; userName: string; userId: string }) => {
        console.log("🔌 [HOOK] User reconnected to support:", data);
        // Можно добавить уведомление или обновление статуса тикета
      }
    );

    newSocket.on("newMessage", (message: ChatMessage) => {
      console.log("💬 [HOOK] New support message:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Обработка истории сообщений при присоединении к тикету
    newSocket.on("ticketMessages", (ticketMessages: ChatMessage[]) => {
      console.log("💬 [HOOK] Received ticket messages:", ticketMessages);
      console.log("💬 [HOOK] Setting messages to:", ticketMessages);
      setMessages(ticketMessages);
    });

    setSocket(newSocket);
    console.log("🔌 [HOOK] Socket created and event listeners attached");

    return () => {
      console.log("🔌 [HOOK] Cleaning up socket connection");
      newSocket.close();
    };
  }, []);

  const joinAsAdmin = useCallback(() => {
    console.log("👨‍💼 [HOOK] joinAsAdmin called, socket:", !!socket);
    if (socket) {
      console.log("👨‍💼 [HOOK] Emitting joinAsAdmin event");
      socket.emit("joinAsAdmin", { adminName: "Support" });
      setUserName("[ADMIN] Support");
      console.log("👨‍💼 [HOOK] joinAsAdmin event emitted");
    }
  }, [socket]);

  const joinTicket = useCallback(
    (ticketId: string) => {
      console.log("👨‍💼 [HOOK] joinTicket called with ticketId:", ticketId);
      if (socket) {
        console.log("👨‍💼 [HOOK] Joining ticket:", ticketId);
        // Очищаем сообщения перед присоединением к новому тикету
        setMessages([]);
        socket.emit("joinTicket", { ticketId });
        setSelectedTicket(ticketId);
        console.log("👨‍💼 [HOOK] joinTicket event emitted");
      }
    },
    [socket]
  );

  const createSupportTicket = useCallback(
    (data: { userName: string; initialMessage: string }) => {
      console.log("🎫 [HOOK] createSupportTicket called with data:", data);
      if (socket) {
        // Устанавливаем имя пользователя при создании тикета
        setUserName(data.userName);
        console.log("🎫 [HOOK] Emitting createSupportTicket event");
        socket.emit("createSupportTicket", data);
        console.log("🎫 [HOOK] createSupportTicket event emitted");
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (message: string) => {
      console.log("💬 [HOOK] sendMessage called with:", message);
      if (socket && message.trim()) {
        console.log("💬 [HOOK] Emitting sendSupportMessage");
        socket.emit("sendSupportMessage", {
          message,
          userName: userName,
        });
        console.log("💬 [HOOK] sendSupportMessage event emitted");
      }
    },
    [socket, userName]
  );

  const sendAdminMessage = useCallback(
    (message: string, ticketId: string) => {
      console.log(
        "👨‍💼 [HOOK] sendAdminMessage called with:",
        message,
        "for ticket:",
        ticketId
      );
      if (socket && message.trim() && ticketId) {
        console.log("👨‍💼 [HOOK] Emitting sendAdminMessage");
        socket.emit("sendAdminMessage", {
          message,
          userName: userName,
          ticketId: ticketId,
        });
        console.log("👨‍💼 [HOOK] sendAdminMessage event emitted");
      }
    },
    [socket, userName]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setUser = useCallback((name: string) => {
    setUserName(name);
  }, []);

  return {
    messages,
    isConnected,
    userName,
    tickets,
    selectedTicket,
    socket,
    joinAsAdmin,
    joinTicket,
    createSupportTicket,
    sendMessage,
    sendAdminMessage,
    clearMessages,
    setUser,
    setMessages,
  };
};
