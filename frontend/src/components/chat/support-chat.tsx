import React, { useState, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/types";
import { Headset, X } from "lucide-react";

export const SupportChat: React.FC = () => {
  const {
    messages,
    isConnected,
    userName,
    tickets,
    selectedTicket,
    joinAsAdmin,
    joinTicket,
    createSupportTicket,
    sendMessage,
    clearMessages,
    setUser,
  } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinUserName, setJoinUserName] = useState("");
  const [ticketCreated, setTicketCreated] = useState(false);
  const [isWaitingForSupport, setIsWaitingForSupport] = useState(false);
  const [smallScreen, setSmallScreen] = useState(true);
  const handleCreateTicket = () => {
    console.log("🎫 [SUPPORT_CHAT] handleCreateTicket called");
    if (joinUserName.trim()) {
      const initialMessage = inputMessage || "Нужна помощь";
      console.log("🎫 [SUPPORT_CHAT] Creating ticket with data:", {
        joinUserName,
        initialMessage,
      });

      // Создаем тикет поддержки
      createSupportTicket({
        userName: joinUserName,
        initialMessage: initialMessage,
      });

      setShowJoinForm(false);
      setTicketCreated(true);
      setIsWaitingForSupport(true);
      setInputMessage("");
      console.log("🎫 [SUPPORT_CHAT] Ticket creation initiated");
    }
  };

  const handleSendMessage = () => {
    console.log(
      "💬 [SUPPORT_CHAT] handleSendMessage called with:",
      inputMessage
    );
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
      console.log("💬 [SUPPORT_CHAT] Message sent");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  console.log("💬 [SUPPORT_CHAT] smallScreen:", smallScreen);
  console.log("💬 [SUPPORT_CHAT] showJoinForm:", showJoinForm);
  console.log("💬 [SUPPORT_CHAT] ticketCreated:", ticketCreated);

  if (smallScreen) {
    return (
      <div className="fixed bottom-10 right-10 transition-all duration-600">
        <button
          className="cursor-pointer hover:scale-110 transition-all duration-300"
          onClick={() => {
            setSmallScreen(false);
            setShowJoinForm(true);
          }}
        >
          <Headset />
        </button>
      </div>
    );
  }

  if (showJoinForm) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 border-2 ">
        <div className="flex justify-between  mb-4">
          <h3 className="text-lg font-semibold mb-4 ">Поддержка</h3>
          <div className="cursor-pointer">
            <X
              onClick={() => {
                setShowJoinForm(false);
                setSmallScreen(true);
              }}
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Ваше имя"
          value={joinUserName}
          onChange={(e) => setJoinUserName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          onKeyPress={(e) => e.key === "Enter" && handleCreateTicket()}
        />
        <textarea
          placeholder="Опишите вашу проблему..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="w-full p-2 border rounded mb-2 h-20 resize-none"
        />
        <button
          onClick={handleCreateTicket}
          className="w-full bg-black text-white p-2 rounded  cursor-pointer"
        >
          Написать в поддержку
        </button>
      </div>
    );
  }

  if (ticketCreated)
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col border-2 border-blue-500">
        {/* Header */}
        <div className="p-4 border-b bg-blue-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-600">Поддержка</h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">{userName}</span>
            </div>
          </div>
          {isWaitingForSupport && (
            <div className="text-xs text-blue-600 mt-1">
              Ожидайте ответа от поддержки...
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg: ChatMessage) => (
            <div
              key={msg.id || Math.random()}
              className={`flex ${
                msg.userName === userName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg ${
                  msg.userName === userName
                    ? "bg-blue-600 text-white"
                    : msg.userName === "System"
                    ? "bg-gray-200 text-gray-600 text-center w-full"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.userName !== "System" && msg.userName !== userName && (
                  <div className="text-xs text-gray-500 mb-1">
                    {msg.userName}
                  </div>
                )}
                <div>{msg.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(
                    msg.createdAt || msg.timestamp || Date.now()
                  ).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2 flex-col">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Введите сообщение..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    );
};
