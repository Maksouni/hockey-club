import React, { useState } from "react";
import { TextField, Button, Alert, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "../utils/auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/dotenv";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerError, setRegisterError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!password) newErrors.password = "Введите пароль";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Пароли не совпадают";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/register`, {
        email,
        password,
      });

      login(response.data.token);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          setRegisterError("Ошибка сети. Проверьте соединение или сервер.");
        } else if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setRegisterError(data.message || "Ошибка запроса");
          } else if (status === 409) {
            setRegisterError("Пользователь с таким email уже существует");
          } else {
            setRegisterError(
              `Ошибка сервера (${status}): ${
                data.message || "Попробуйте позже"
              }`
            );
          }
        } else {
          setRegisterError("Неизвестная ошибка. Попробуйте позже.");
        }
      } else {
        setRegisterError("Произошла неожиданная ошибка");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    if (field === "email") setEmail(e.target.value);
    if (field === "password") setPassword(e.target.value);
    if (field === "confirmPassword") setConfirmPassword(e.target.value);
  };

  return (
    <form style={{ width: "100%" }} onSubmit={handleRegister}>
      <Stack spacing={2} sx={{ width: "100%" }}>
        {registerError && <Alert severity="error">{registerError}</Alert>}

        <TextField
          label="Email"
          variant="outlined"
          value={email}
          type="email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />

        <TextField
          label="Пароль"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "password")
          }
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
        />

        <TextField
          label="Подтвердите пароль"
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "confirmPassword")
          }
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          fullWidth
        />

        <Button
          sx={{ height: "3rem" }}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Зарегистрироваться
        </Button>
        <Typography variant="body1" style={{ marginInline: "auto" }}>
          Уже есть аккаунт?{" "}
          <Link
            to="/auth/login"
            style={{
              textDecoration: "none",
            }}
          >
            <span style={{ textDecoration: "none", cursor: "pointer" }}>
              Войти
            </span>
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
