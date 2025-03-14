import { useEffect, useState } from "react";
import { Paper, Typography, TextField, Stack, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "../../utils/api/axios";
import { apiUrl } from "../../utils/dotenv";

interface User {
  id: number;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  roleName: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Unexpected response data:", response.data);
      }
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Фильтрация по email (опционально)
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const parts = dateString.split("T");
    if (parts.length < 2) return dateString;
    const datePart = parts[0];
    // Убираем миллисекунды и "Z"
    const timePart = parts[1].split(".")[0];
    return `${datePart} ${timePart}`;
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "email", headerName: "Email", width: 200, editable: true },
    { field: "roleName", headerName: "Роль", width: 150, editable: true },
    { field: "avatar_url", headerName: "Avatar URL", width: 200 },
    {
      field: "created_at",
      headerName: "Создан",
      width: 180,
      renderCell: (params) => {
        return <span>{formatDate(params.value as string)}</span>;
      },
    },
    {
      field: "updated_at",
      headerName: "Обновлён",
      width: 180,
      renderCell: (params) => {
        return <span>{formatDate(params.value as string)}</span>;
      },
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        px: 4,
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <Typography variant="h4">Управление пользователями</Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          variant="standard"
          label="Поиск"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="success">
          Добавить
        </Button>
      </Stack>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ maxWidth: "fit-content" }}
        >
          Сохранить
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ maxWidth: "fit-content" }}
        >
          Удалить выбранные
        </Button>
      </Stack>
    </Paper>
  );
}
