import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider } from "./utils/auth/AuthProvider";
import Header from "./components/Header";

function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      {location.pathname.startsWith("/auth") ? null : <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
