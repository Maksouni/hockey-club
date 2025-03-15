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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      const getProfile = async () => {
        try {
          const response = await axios.get(`${apiUrl}/auth/profile`);
          setRole(response.data.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.log(error);
          setIsAuthenticated(false);
          setRole("");
        } finally {
          setLoading(false);
        }
      };
      getProfile();
    } else {
      setIsAuthenticated(false);
      setRole("");
      setLoading(false);
    }
  }, []);

  const login = (token: string) => {
    Cookies.set("jwt_token", token, {
      expires: 1,
      secure: false,
      sameSite: "Strict",
    });
    setIsAuthenticated(true);

    const getProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/profile`);
        setRole(response.data.role);
        console.log(response.data.role);
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
    setRole("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, role, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
