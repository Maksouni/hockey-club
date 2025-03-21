import { Box, Paper, Stack, Typography } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

export default function AuthPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "linear-gradient(45deg,rgb(158, 107, 254) 30%,rgb(83, 123, 255) 90%)",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "1.5rem", color: "white" }}>
        ХК «Паровоз»
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: 4, p: "1rem", minWidth: "xl" }}>
        <Stack spacing={2} sx={{ p: 2, alignItems: "center" }}>
          <Typography variant="h4">Добро пожаловать!</Typography>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Typography variant="body1">На главную</Typography>
          </NavLink>
          {/* <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => navigate("/auth/login")}>
              Войти
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/auth/register")}
            >
              Регистрация
            </Button>
          </Stack> */}
          <Outlet />
        </Stack>
      </Paper>
    </Box>
  );
}
