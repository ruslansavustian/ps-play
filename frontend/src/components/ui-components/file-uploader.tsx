import React, { useState, useRef } from "react";
import { Button, Progress } from "@heroui/react";
import { Upload, X, CheckCircle } from "lucide-react";
import request from "@/lib/request";
import { useTranslations } from "next-intl";

interface FileUploadProps {
  onFileUploaded: (fileUrl: string) => void;
  accept?: string;
  maxSize?: number; // в MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  accept = "image/*",
  maxSize = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("common");
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация размера
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл слишком большой. Максимум ${maxSize}MB`);
      return;
    }

    // Валидация типа
    if (!file.type.startsWith("image/")) {
      setError("Разрешены только изображения");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await request.post("/s3/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(progressInterval);

      if (!response.data.success) {
        throw new Error("Ошибка загрузки файла");
      }

      const result = response.data;

      setUploadProgress(100);
      setUploadedFile(result.fileUrl);
      onFileUploaded(result.fileUrl);

      setTimeout(() => {
        setUploadedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!uploadedFile && !isUploading && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Button
              color="primary"
              variant="flat"
              onPress={triggerFileSelect}
              disabled={isUploading}
            >
              {t("selectFile")}
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              PNG, JPG до {maxSize}MB
            </p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("loading")}</span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {uploadedFile && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">
                {t("fileUploaded")}
              </span>
            </div>
            <Button size="sm" variant="light" onPress={handleRemoveFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <img
            src={uploadedFile}
            alt="Uploaded"
            className="mt-2 max-h-32 rounded object-cover"
          />
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
