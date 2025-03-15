import { Box } from "@mui/material";
import UserManagment from "../components/admin/UsersManagment";
import TrainingsManagement from "../components/admin/TrainingsManagment";

export default function AdminPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 4,
        margin: 4,
        mx: "auto",

        maxWidth: "1200px",
      }}
    >
      {/* users */}
      <UserManagment />
      {/* trainings */}
      <TrainingsManagement />
    </Box>
  );
}
