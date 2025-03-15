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
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "../../utils/api/axios";
import { apiUrl } from "../../utils/dotenv";

interface Employee {
  id: number;
  surname: string;
  name: string;
  patronymic?: string;
  birthdate: string;
  position_id: number;
  user_id?: number;
}

export default function EmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    surname: "",
    name: "",
    patronymic: "",
    birthdate: "",
    position_id: "",
    user_id: "",
  });
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/employees`);
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        console.error("Unexpected response data:", response.data);
      }
    } catch (error) {
      console.error("Ошибка при получении сотрудников:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post(`${apiUrl}/employees`, {
        surname: newEmployee.surname,
        name: newEmployee.name,
        patronymic: newEmployee.patronymic,
        birthdate: newEmployee.birthdate,
        position_id: newEmployee.position_id
          ? Number(newEmployee.position_id)
          : undefined,
        user_id: newEmployee.user_id ? Number(newEmployee.user_id) : undefined,
      });
      fetchEmployees();
      handleCloseAdd();
    } catch (error) {
      console.error("Ошибка при добавлении сотрудника:", error);
    }
  };

  const handleDeleteEmployees = async () => {
    try {
      for (const id of selectedEmployees) {
        await axios.delete(`${apiUrl}/employees/${id}`);
      }
      fetchEmployees();
      handleConfirmClose();
    } catch (error) {
      console.error("Ошибка при удалении сотрудников:", error);
    }
  };

  const handleEditOpen = (employee: Employee) => {
    setEditEmployee(employee);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditEmployee(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editEmployee) return;
    const { name, value } = e.target;
    setEditEmployee({ ...editEmployee, [name]: value });
  };

  const handleUpdateEmployee = async () => {
    if (!editEmployee) return;
    try {
      await axios.patch(`${apiUrl}/employees/${editEmployee.id}`, {
        surname: editEmployee.surname,
        name: editEmployee.name,
        patronymic: editEmployee.patronymic,
        birthdate: editEmployee.birthdate,
        position_id: editEmployee.position_id,
        user_id: editEmployee.user_id,
      });
      fetchEmployees();
      handleEditClose();
    } catch (error) {
      console.error("Ошибка при обновлении сотрудника:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.surname} ${employee.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "surname", headerName: "Фамилия", width: 150 },
    { field: "name", headerName: "Имя", width: 150 },
    { field: "patronymic", headerName: "Отчество", width: 150 },
    { field: "birthdate", headerName: "Дата рождения", width: 150 },
    { field: "position_id", headerName: "ID позиции", width: 100 },
    { field: "user_id", headerName: "ID пользователя", width: 100 },
    {
      field: "actions",
      headerName: "Действия",
      width: 150,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleEditOpen(params.row)}>
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
      <Typography variant="h4">Управление сотрудниками</Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          variant="standard"
          label="Поиск"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="success" onClick={handleOpenAdd}>
          Добавить сотрудника
        </Button>
      </Stack>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) =>
            setSelectedEmployees(newSelection as number[])
          }
          getRowId={(row) => row.id}
        />
      </div>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button variant="contained" color="error" onClick={handleConfirmOpen}>
          Удалить выбранных
        </Button>
      </Stack>

      {/* Диалог добавления сотрудника */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Добавить сотрудника</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="surname"
            label="Фамилия"
            fullWidth
            variant="standard"
            value={newEmployee.surname}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="name"
            label="Имя"
            fullWidth
            variant="standard"
            value={newEmployee.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="patronymic"
            label="Отчество"
            fullWidth
            variant="standard"
            value={newEmployee.patronymic}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="birthdate"
            label="Дата рождения (YYYY-MM-DD)"
            fullWidth
            variant="standard"
            value={newEmployee.birthdate}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="position_id"
            label="ID позиции"
            fullWidth
            variant="standard"
            value={newEmployee.position_id}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="user_id"
            label="ID пользователя"
            fullWidth
            variant="standard"
            value={newEmployee.user_id}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Отмена</Button>
          <Button onClick={handleAddEmployee} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить выбранных сотрудников?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Отмена</Button>
          <Button onClick={handleDeleteEmployees} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования сотрудника */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Редактировать сотрудника</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="surname"
            label="Фамилия"
            fullWidth
            variant="standard"
            value={editEmployee?.surname || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="name"
            label="Имя"
            fullWidth
            variant="standard"
            value={editEmployee?.name || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="patronymic"
            label="Отчество"
            fullWidth
            variant="standard"
            value={editEmployee?.patronymic || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="birthdate"
            label="Дата рождения (YYYY-MM-DD)"
            fullWidth
            variant="standard"
            value={editEmployee?.birthdate || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="position_id"
            label="ID позиции"
            fullWidth
            variant="standard"
            value={editEmployee?.position_id || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="user_id"
            label="ID пользователя"
            fullWidth
            variant="standard"
            value={editEmployee?.user_id || ""}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Отмена</Button>
          <Button onClick={handleUpdateEmployee} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
