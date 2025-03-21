import React, { useState } from "react";
import { TextField, Button, Alert, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "../utils/auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/dotenv";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!password) newErrors.password = "Введите пароль";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      login(response.data.access_token);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          setLoginError("Ошибка сети. Проверьте соединение или сервер.");
        } else if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            setLoginError("Неверный email или пароль");
          } else if (status === 400) {
            setLoginError(data.message || "Ошибка запроса");
          } else {
            setLoginError(
              `Ошибка сервера (${status}): ${
                data.message || "Попробуйте позже"
              }`
            );
          }
        } else {
          setLoginError("Неизвестная ошибка. Попробуйте позже.");
        }
      } else {
        setLoginError("Произошла неожиданная ошибка");
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
  };

  return (
    <form style={{ width: "100%" }} onSubmit={handleLogin}>
      <Stack spacing={2} sx={{ width: "100%" }}>
        {loginError && <Alert severity="error">{loginError}</Alert>}

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

        <Button
          sx={{ height: "3rem" }}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Войти
        </Button>
        <Typography variant="body1" style={{ marginInline: "auto" }}>
          Ещё нет аккаунта?{" "}
          <Link
            to="/auth/register"
            style={{
              textDecoration: "none",
            }}
          >
            <span style={{ textDecoration: "none", cursor: "pointer" }}>
              Зарегистрироваться
            </span>
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
