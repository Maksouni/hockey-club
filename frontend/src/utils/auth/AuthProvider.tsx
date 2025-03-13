import { ReactNode, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (!token) setIsAuthenticated(false);
  }, []);

  const login = (token: string) => {
    Cookies.set("jwt_token", token, {
      expires: 1, // жизнь токена
      secure: false, // true - только через HTTPS
      sameSite: "Strict", // куки отправляются только на тот же домен
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
