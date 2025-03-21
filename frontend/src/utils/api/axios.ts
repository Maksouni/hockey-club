// src/api/axios.js
import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "../dotenv";

const instance = axios.create({
  baseURL: apiUrl,
});

// Добавляем токен в заголовки для каждого запроса
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Обрабатываем ошибки ответов
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("jwt_token"); // Удаляем токен
      window.location.href = "/login"; // Редирект на страницу логина
    }
    return Promise.reject(error);
  }
);

export default instance;
