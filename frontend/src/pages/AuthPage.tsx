import { Box, Paper, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "1.5rem" }}>
        ХК «Паровоз»
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: 4, p: "1rem", minWidth: "xl" }}>
        <Stack spacing={2} sx={{ p: 2, alignItems: "center" }}>
          <Typography variant="h4">Добро пожаловать!</Typography>
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
