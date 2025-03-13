import { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (_token: string) => {},
  logout: () => {},
});
