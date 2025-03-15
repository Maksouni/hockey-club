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
import { Role, RoleIds } from "../../utils/role.enum";

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

  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    roleName: Role.Fan,
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
        roleId: RoleIds[newUser.roleName as unknown as keyof typeof RoleIds],
      });
      fetchUsers();
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
      fetchUsers();
      handleConfirmClose();
    } catch (error) {
      console.error("Ошибка при удалении пользователей:", error);
    }
  };

  const handleEditOpen = (user: User) => {
    setEditUser(user);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditUser(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editUser) return;
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleEditRoleChange = (e: SelectChangeEvent) => {
    if (!editUser) return;
    setEditUser({ ...editUser, roleName: e.target.value as Role });
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      await axios.patch(`${apiUrl}/users/${editUser.id}`, {
        email: editUser.email,
        roleId: RoleIds[editUser.roleName as unknown as keyof typeof RoleIds],
      });
      fetchUsers();
      handleEditClose();
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
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
    { field: "email", headerName: "Email", width: 200 },
    { field: "roleName", headerName: "Роль", width: 150 },
    { field: "avatar_url", headerName: "Avatar URL", width: 200 },
    {
      field: "created_at",
      headerName: "Создан",
      width: 180,
      renderCell: (params) => <span>{formatDate(params.value as string)}</span>,
    },
    {
      field: "updated_at",
      headerName: "Обновлён",
      width: 180,
      renderCell: (params) => <span>{formatDate(params.value as string)}</span>,
    },
    {
      field: "actions",
      headerName: "Действия",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEditOpen(params.row)}
        >
          Редактировать
        </Button>
      ),
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

      {/* Диалог добавления пользователя */}
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

      {/* Диалог подтверждения удаления */}
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

      {/* Диалог редактирования пользователя */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Редактировать пользователя</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={editUser?.email || ""}
            onChange={handleEditInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-role-label">Роль</InputLabel>
            <Select
              labelId="edit-role-label"
              name="roleName"
              value={editUser?.roleName || ""}
              onChange={handleEditRoleChange}
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
          <Button onClick={handleEditClose}>Отмена</Button>
          <Button onClick={handleUpdateUser} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
