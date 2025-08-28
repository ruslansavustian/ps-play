const { ipcRenderer } = require("electron");

// Элементы UI
const serverStatus = document.getElementById("serverStatus");
const serverStatusText = document.getElementById("serverStatusText");
const serverPort = document.getElementById("serverPort");
const lastUpdate = document.getElementById("lastUpdate");
const logsContainer = document.getElementById("logsContainer");
const apiConfigForm = document.getElementById("apiConfigForm");

// Массив для хранения логов
let logs = [];

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  checkServerStatus();
  updateServerStatusUI("running");

  // Проверяем статус каждые 5 секунд
  setInterval(checkServerStatus, 5000);

  // Обработчик формы настроек
  apiConfigForm.addEventListener("submit", handleConfigSubmit);

  // Слушаем события от главного процесса
  ipcRenderer.on("receipt-processed", handleReceiptProcessed);
});

// Проверка статуса сервера
async function checkServerStatus() {
  try {
    const status = await ipcRenderer.invoke("get-server-status");
    updateServerStatusUI(status.status);
    updateServerInfo(status);
  } catch (error) {
    console.error("Error checking server status:", error);
    updateServerStatusUI("stopped");
  }
}

// Обновление UI статуса сервера
function updateServerStatusUI(status) {
  serverStatus.textContent =
    status === "running" ? "🟢 Работает" : "🔴 Остановлен";
  serverStatus.className = `status ${status}`;
}

// Обновление информации о сервере
function updateServerInfo(status) {
  serverStatusText.textContent =
    status.status === "running" ? "Работает" : "Остановлен";
  serverPort.textContent = status.port || "3000";
  lastUpdate.textContent = new Date(status.timestamp).toLocaleString("ru-RU");
}

// Обработка отправки формы настроек
async function handleConfigSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const config = {
    baseURL: document.getElementById("baseURL").value,
    clientName: document.getElementById("clientName").value,
    clientVersion: document.getElementById("clientVersion").value,
  };

  try {
    const result = await ipcRenderer.invoke("update-api-config", config);
    if (result.success) {
      addLog("success", "Настройки API обновлены", config);
      showNotification("Настройки сохранены!", "success");
    }
  } catch (error) {
    addLog("error", "Ошибка обновления настроек", error.message);
    showNotification("Ошибка сохранения настроек!", "error");
  }
}

// Обработка обработанного чека
function handleReceiptProcessed(event, data) {
  const { timestamp, request, response, error, status } = data;

  if (status === "success") {
    addLog("success", `Чек обработан успешно (ID: ${request.custom_id})`, {
      request: request,
      response: response,
    });
  } else {
    addLog("error", `Ошибка обработки чека: ${error}`, {
      request: request,
      error: error,
    });
  }
}

// Добавление лога
function addLog(type, message, data = null) {
  const timestamp = new Date().toLocaleString("ru-RU");
  const logEntry = {
    type,
    timestamp,
    message,
    data,
  };

  logs.unshift(logEntry);

  // Ограничиваем количество логов
  if (logs.length > 100) {
    logs = logs.slice(0, 100);
  }

  renderLogs();
}

// Отрисовка логов
function renderLogs() {
  logsContainer.innerHTML = "";

  logs.forEach((log) => {
    const logElement = document.createElement("div");
    logElement.className = `log-entry ${log.type}`;

    const timestampElement = document.createElement("div");
    timestampElement.className = "log-timestamp";
    timestampElement.textContent = log.timestamp;

    const messageElement = document.createElement("div");
    messageElement.textContent = log.message;

    logElement.appendChild(timestampElement);
    logElement.appendChild(messageElement);

    if (log.data) {
      const dataElement = document.createElement("div");
      dataElement.className = "log-data";
      dataElement.textContent = JSON.stringify(log.data, null, 2);
      logElement.appendChild(dataElement);
    }

    logsContainer.appendChild(logElement);
  });
}

// Очистка логов
function clearLogs() {
  logs = [];
  renderLogs();
  showNotification("Логи очищены!", "success");
}

// Показ уведомлений
function showNotification(message, type = "info") {
  // Создаем простое уведомление
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        background: ${
          type === "success"
            ? "#27ae60"
            : type === "error"
            ? "#e74c3c"
            : "#3498db"
        };
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Глобальные функции для HTML
window.checkServerStatus = checkServerStatus;
window.clearLogs = clearLogs;

// Добавляем первый лог при запуске
addLog("success", "Приложение запущено", {
  version: "1.0.0",
  timestamp: new Date().toISOString(),
});
