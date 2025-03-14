import { ReactNode, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";
import axios from "../api/axios";
import { apiUrl } from "../dotenv";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      try {
        const getProfile = async () => {
          const response = await axios.get(`${apiUrl}/auth/profile`);
          setRole(response.data.role);
          setIsAuthenticated(true);
        };
        getProfile();
      } catch (error) {
        console.log(error);
      }
    } else {
      setRole("");
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token: string) => {
    Cookies.set("jwt_token", token, {
      expires: 1, // жизнь токена
      secure: false, // true - только через HTTPS
      sameSite: "Strict", // куки отправляются только на тот же домен
    });
    setIsAuthenticated(true);

    const getProfile = async () => {
      const response = await axios.get(`${apiUrl}/auth/profile`);
      setRole(response.data.role);
    };
    getProfile();
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
    setRole("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};
