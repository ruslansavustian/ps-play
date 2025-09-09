import { useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage } from "@/types";

export const useChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const connectSocket = useCallback(() => {
    if (!socket) {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
      const newSocket = io(wsUrl);
      const savedUserName = localStorage.getItem("supportUserName");
      const savedTicketId = localStorage.getItem("supportTicketId");

      if (savedUserName) {
        setUserName(savedUserName);
      }
      if (savedTicketId) {
        setSelectedTicket(savedTicketId);
      }
      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("savedTicketId", savedTicketId);
        console.log("savedUserName", savedUserName);
        if (savedTicketId && savedUserName) {
          newSocket.emit("joinTicket", { ticketId: savedTicketId });
        }
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      newSocket.on("newSupportTicket", (ticket: any) => {
        setTickets((prev) => [...prev, ticket]);
        localStorage.setItem("supportTicketId", ticket.id);
        setSelectedTicket(ticket.id);
      });

      newSocket.on("supportTicketsList", (ticketsList: any[]) => {
        setTickets(ticketsList);
      });

      newSocket.on(
        "userDisconnected",
        (data: { ticketId: string; userName: string; userId: string }) => {
          // User disconnected from support
        }
      );

      newSocket.on(
        "userReconnected",
        (data: { ticketId: string; userName: string; userId: string }) => {
          // User reconnected to support
        }
      );

      newSocket.on("newMessage", (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on("ticketMessages", (ticketMessages: ChatMessage[]) => {
        setMessages(ticketMessages);
      });

      setSocket(newSocket);
    }
  }, [socket]);

  const joinAsAdmin = useCallback(() => {
    if (socket) {
      socket.emit("joinAsAdmin", { adminName: "Support" });
      setUserName("[ADMIN] Support");
    }
  }, [socket]);

  const joinTicket = useCallback(
    (ticketId: string) => {
      if (socket) {
        setMessages([]);
        socket.emit("joinTicket", { ticketId });
        setSelectedTicket(ticketId);
      }
    },
    [socket]
  );

  const createSupportTicket = useCallback(
    (data: { userName: string; initialMessage: string }) => {
      if (socket) {
        setUserName(data.userName);
        localStorage.setItem("supportUserName", data.userName);
        socket.emit("createSupportTicket", data);
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && message.trim()) {
        socket.emit("sendSupportMessage", {
          message,
          userName: userName,
        });
      }
    },
    [socket, userName]
  );

  const sendAdminMessage = useCallback(
    (message: string, ticketId: string) => {
      if (socket && message.trim() && ticketId) {
        socket.emit("sendAdminMessage", {
          message,
          userName: userName,
          ticketId: ticketId,
        });
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
    connectSocket,
  };
};
