"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { loginSchema, useFormState } from "@/utils/form";

import { MyButton } from "../../../components/ui-components/my-button";
import { ErrorContainer } from "../../../components/ui-components/error-container";

import { Input } from "@heroui/react";
import { paths } from "@/utils/paths";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import { login, selectCurrentUser } from "@/stores(REDUX)/slices/auth-slice";
import { LoginDto } from "@/types";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const { formData, handleChange, errors, isFormValid } = useFormState(
    {
      email: "",
      password: "",
    },
    loginSchema
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const result = await dispatch(login(formData as LoginDto)).unwrap();
      if (result) {
        router.push(paths.dashboard);
      }
    },
    [dispatch, formData, router]
  );

  useEffect(() => {
    if (currentUser) {
      router.push(paths.dashboard);
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
            <Input
              label="Почта"
              type="email"
              autoComplete="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className=""
              validationBehavior="aria"
              isInvalid={!!errors.email}
              placeholder="Email адрес"
              errorMessage={errors.email}
            />

            <Input
              label="Пароль"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className=""
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              placeholder="Пароль"
            />

            <ErrorContainer />

            <div className="flex justify-center">
              <MyButton title={"Войти"} type="submit" disabled={!isFormValid} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
