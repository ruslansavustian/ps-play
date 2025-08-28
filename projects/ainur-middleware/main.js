const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

let mainWindow;
let server;

// Настройки API
const API_CONFIG = {
  baseURL: "http://127.0.0.1:9200/api/v1",
  clientName: "Ainur-Middleware",
  clientVersion: "1.0.0",
};

// Создание главного окна
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "icon.ico"),
  });

  mainWindow.loadFile("index.html");

  // Открыть DevTools в режиме разработки
  if (process.argv.includes("--dev")) {
    mainWindow.webContents.openDevTools();
  }
}

// HTTP сервер для приема данных от кассы
function startServer() {
  const expressApp = express();
  expressApp.use(express.json());

  // Middleware для логирования
  expressApp.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Обработка чеков
  expressApp.post("/receipt", async (req, res) => {
    try {
      console.log("Received receipt data:", JSON.stringify(req.body, null, 2));

      // Генерируем UUID если его нет
      const receiptData = {
        ...req.body,
        custom_id: req.body.custom_id || uuidv4(),
      };

      // Отправляем данные в API
      const apiResponse = await axios.post(
        `${API_CONFIG.baseURL}/receipt/sell`,
        receiptData,
        {
          headers: {
            accept: "application/json",
            "X-Client-Name": API_CONFIG.clientName,
            "X-Client-Version": API_CONFIG.clientVersion,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", apiResponse.data);

      // Отправляем ответ кассе
      res.json(apiResponse.data);

      // Отправляем данные в UI для отображения
      if (mainWindow) {
        mainWindow.webContents.send("receipt-processed", {
          timestamp: new Date().toISOString(),
          request: receiptData,
          response: apiResponse.data,
          status: "success",
        });
      }
    } catch (error) {
      console.error("Error processing receipt:", error.message);

      const errorResponse = {
        error: error.message,
        status: "error",
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(errorResponse);

      // Отправляем ошибку в UI
      if (mainWindow) {
        mainWindow.webContents.send("receipt-processed", {
          timestamp: new Date().toISOString(),
          request: req.body,
          error: error.message,
          status: "error",
        });
      }
    }
  });

  // Статус сервера
  expressApp.get("/status", (req, res) => {
    res.json({
      status: "running",
      timestamp: new Date().toISOString(),
      port: 3000,
    });
  });

  // Запускаем сервер
  server = expressApp.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

// Обработчики IPC
ipcMain.handle("get-server-status", () => {
  return {
    status: server ? "running" : "stopped",
    port: 3000,
    timestamp: new Date().toISOString(),
  };
});

ipcMain.handle("update-api-config", (event, config) => {
  Object.assign(API_CONFIG, config);
  return { success: true, config: API_CONFIG };
});

// События приложения
app.whenReady().then(() => {
  createWindow();
  startServer();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (server) {
    server.close();
  }
});
