import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "../../utils/api/axios";
import { apiUrl } from "../../utils/dotenv";
import { Role, RoleIds } from "../../utils/role.enum"; // Adjust the import path as needed

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
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    roleName: Role.Fan, // Default role
  });

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setNewUser((prev) => ({ ...prev, roleName: e.target.value as Role }));
  };

  const handleAddUser = async () => {
    try {
      await axios.post(`${apiUrl}/users`, {
        email: newUser.email,
        password: newUser.password,
        roleId: RoleIds[newUser.roleName as unknown as keyof typeof RoleIds], // Set role ID
      });
      fetchUsers(); // Refresh the user list
      handleClose();
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      for (const userId of selectedUsers) {
        await axios.delete(`${apiUrl}/users/${userId}`);
      }
      fetchUsers(); // Refresh the user list
      handleConfirmClose();
    } catch (error) {
      console.error("Ошибка при удалении пользователей:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const parts = dateString.split("T");
    if (parts.length < 2) return dateString;
    const datePart = parts[0];
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
        <Button variant="contained" color="success" onClick={handleClickOpen}>
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
          onRowSelectionModelChange={(rowSelectionModel) => {
            setSelectedUsers(rowSelectionModel as number[]);
          }}
        />
      </div>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="error"
          sx={{ maxWidth: "fit-content" }}
          onClick={handleConfirmOpen}
        >
          Удалить выбранные
        </Button>
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавить пользователя</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Пароль"
            type="password"
            fullWidth
            variant="standard"
            value={newUser.password}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Роль</InputLabel>
            <Select
              labelId="role-label"
              name="roleName"
              value={newUser.roleName}
              onChange={handleRoleChange}
              variant="standard"
            >
              {Object.values(Role).map((role) => (
                <MenuItem key={role as string} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleAddUser} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить выбранных пользователей?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Отмена</Button>
          <Button onClick={handleDeleteUsers} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
