import React, { useState } from "react";
interface InputChangeEvent {
  target: {
    name: string;
    value: string;
  };
}
export interface FormState {
  email?: string;
  password?: string;
}

export type StatusType = "default" | "success" | "error";

export const useFormState = (initialData: FormState) => {
  const [formData, setFormData] = useState<FormState>(initialData);
  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const status = validateInput(name, value);
    setInputStatus((prev) => ({
      ...prev,
      [name]: status,
    }));
  };
  const [inputStatus, setInputStatus] = useState<Record<string, StatusType>>(
    {}
  );

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check for invalid patterns in the email
        const hasInvalidDashes =
          value.includes("--") ||
          value.endsWith("-") ||
          value.startsWith("-") ||
          /-\./.test(value) || // Dash followed by dot
          /\.-/.test(value) || // Dot followed by dash
          /-@/.test(value) || // Dash before @
          /@-/.test(value); // Dash after @

        // Check for dashes in domain part
        const domainParts = value.split("@")[1]?.split(".") || [];
        const hasDashInDomainPart = domainParts.some((part) =>
          part.includes("-")
        );

        return emailRegex.test(value) &&
          !hasInvalidDashes &&
          !hasDashInDomainPart
          ? "success"
          : "error";

      case "password":
        return value.trim().length >= 8 ? "success" : "error";

      default:
        return "default";
    }
  };

  const resetForm = () => {
    setFormData({});
    setInputStatus({});
  };
  const isFormValid = Object.values(inputStatus).every(
    (status) => status === "success"
  );
  return {
    formData,
    handleChange,
    resetForm,
    isFormValid,
    inputStatus,
  };
};
