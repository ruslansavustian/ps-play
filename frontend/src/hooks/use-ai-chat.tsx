import request from "@/lib/request";
import { useState, useCallback } from "react";

interface AiResponse {
  message: string;
  type: string;
  sessionId: string;
  timestamp: string;
}

export function useAiChat() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback(async () => {
    try {
      const response = await request.post("/ai/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: "Anonymous",
          language: "uk",
        }),
      });

      if (response.status !== 201) {
        throw new Error("Failed to create session");
      }

      const session = await response.data;
      setSessionId(session.sessionId);
      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string): Promise<AiResponse> => {
      setIsLoading(true);

      try {
        // Create session if not exists
        let currentSessionId = sessionId;
        if (!currentSessionId) {
          const session = await createSession();
          currentSessionId = session.sessionId;
        }

        const response = await request.post("/ai/message", {
          sessionId: currentSessionId,
          message: message,
          isFromUser: true,
        });
        if (response.status !== 201) {
          throw new Error("Failed to send message");
        }

        const aiResponse = await response.data;
        return aiResponse;
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, createSession]
  );

  return {
    sessionId,
    sendMessage,
    isLoading,
    createSession,
  };
}
