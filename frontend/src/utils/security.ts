import CryptoJS from "crypto-js";

export const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const hashPassword = async (password: string): Promise<string> => {
  return CryptoJS.SHA256(password).toString();
};

export const createSecureToken = (password: string, uuid: string): string => {
  const combined = password + uuid + Date.now();
  return CryptoJS.SHA256(combined).toString();
};
