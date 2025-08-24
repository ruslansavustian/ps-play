"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { FormState, useFormState } from "@/utils/form";

import { useApp } from "@/contexts/AppProvider";
import { MyButton } from "../../components/ui-components/my-button";
import { ErrorContainer } from "../../components/ui-components/error-container";
import request from "@/lib/request";

export default function LoginPage() {
  const [error, setError] = useState("");
  const { login, currentUser, setCurrentUser } = useApp();
  const router = useRouter();

  const { formData, handleChange, resetForm, isFormValid, inputStatus } =
    useFormState({
      email: "",
      password: "",
    });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await request.post("/auth/login", formData);

      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      request.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      setCurrentUser(user);
      // await login(formData);
      // router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  console.log(currentUser);
  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-black text-center">
              Войти
            </h2>
          </div>

          <form className="flex flex-col gap-2" onSubmit={onSubmit}>
            <input
              type="email"
              autoComplete="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              placeholder="Email адрес"
            />

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Пароль"
              />
            </div>

            {error && <ErrorContainer message={error} />}

            <div className="flex justify-center">
              <MyButton title={"Войти"} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
