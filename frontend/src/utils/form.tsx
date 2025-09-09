import { useState } from "react";
import z from "zod";
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
export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const useFormState = (initialData: FormState, schema: z.ZodSchema) => {
  const [formData, setFormData] = useState<FormState>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputStatus, setInputStatus] = useState<Record<string, StatusType>>({
    email: "default",
    password: "default",
  });

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = (schema as z.ZodObject<any>).pick({ [name]: true });
      fieldSchema.parse({ [name]: value });

      setErrors((prev) => ({ ...prev, [name]: "" }));
      setInputStatus((prev) => ({ ...prev, [name]: "success" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0].message;

        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
        setInputStatus((prev) => ({ ...prev, [name]: "error" }));
        // setErrors((prev) => ({ ...prev, [name]: errorMessage }));
        // setInputStatus((prev) => ({ ...prev, [name]: "error" }));
        // setErrors((prev) => ({ ...prev, [name]: errorMessage }));
        // setInputStatus((prev) => ({ ...prev, [name]: "error" }));
        // const errorMessage = fieldError?.message || "Неверное значение";
        // setErrors((prev) => ({ ...prev, [name]: errorMessage }));
        // setInputStatus((prev) => ({ ...prev, [name]: "error" }));
      }
      return false;
    }
  };

  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    validateField(name, value);
  };

  const resetForm = () => {
    setFormData({});
    setErrors({});
    setInputStatus({
      email: "default",
      password: "default",
    });
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
    errors,
  };
};
