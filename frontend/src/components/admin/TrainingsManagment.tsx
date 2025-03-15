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

interface Training {
  id: number;
  title: string;
  description?: string;
  training_date: string;
  location: string;
  duration?: number;
  coach_id?: number;
  created_at: string;
  updated_at: string;
}

export default function TrainingsManagement() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTrainings, setSelectedTrainings] = useState<number[]>([]);
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    training_date: "",
    location: "",
    duration: "",
    coach_id: "",
  });
  const [editTraining, setEditTraining] = useState<Training | null>(null);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/trainings`);
      if (Array.isArray(response.data)) {
        setTrainings(response.data);
      } else {
        console.error("Unexpected response data:", response.data);
      }
    } catch (error) {
      console.error("Ошибка при получении тренировок:", error);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  // Открытие/закрытие диалогов
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  // Обработчик ввода для нового тренинга
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTraining((prev) => ({ ...prev, [name]: value }));
  };

  // Добавление тренировки
  const handleAddTraining = async () => {
    try {
      await axios.post(`${apiUrl}/trainings`, {
        title: newTraining.title,
        description: newTraining.description,
        training_date: newTraining.training_date,
        location: newTraining.location,
        duration: newTraining.duration
          ? Number(newTraining.duration)
          : undefined,
        coach_id: newTraining.coach_id
          ? Number(newTraining.coach_id)
          : undefined,
      });
      fetchTrainings();
      handleCloseAdd();
    } catch (error) {
      console.error("Ошибка при добавлении тренировки:", error);
    }
  };

  // Удаление выбранных тренировок
  const handleDeleteTrainings = async () => {
    try {
      for (const id of selectedTrainings) {
        await axios.delete(`${apiUrl}/trainings/${id}`);
      }
      fetchTrainings();
      handleConfirmClose();
    } catch (error) {
      console.error("Ошибка при удалении тренировок:", error);
    }
  };

  // Открытие диалога редактирования тренировки
  const handleEditOpen = (training: Training) => {
    setEditTraining(training);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditTraining(null);
  };

  // Обработчики ввода для редактируемой тренировки
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editTraining) return;
    const { name, value } = e.target;
    setEditTraining({ ...editTraining, [name]: value });
  };

  // Обновление тренировки
  const handleUpdateTraining = async () => {
    if (!editTraining) return;
    try {
      await axios.patch(`${apiUrl}/trainings/${editTraining.id}`, {
        title: editTraining.title,
        description: editTraining.description,
        training_date: editTraining.training_date,
        location: editTraining.location,
        duration: editTraining.duration,
        coach_id: editTraining.coach_id,
      });
      fetchTrainings();
      handleEditClose();
    } catch (error) {
      console.error("Ошибка при обновлении тренировки:", error);
    }
  };

  // Фильтрация по названию тренировки
  const filteredTrainings = trainings.filter((training) =>
    training.title.toLowerCase().includes(search.toLowerCase())
  );

  // Функция форматирования даты
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const parts = dateString.split("T");
    if (parts.length < 2) return dateString;
    const datePart = parts[0];
    const timePart = parts[1].split(".")[0];
    return `${datePart} ${timePart}`;
  };

  // Определение столбцов для DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Название", width: 200 },
    { field: "description", headerName: "Описание", width: 250 },
    {
      field: "training_date",
      headerName: "Дата тренировки",
      width: 180,
      renderCell: (params) => <span>{formatDate(params.value as string)}</span>,
    },
    { field: "location", headerName: "Локация", width: 150 },
    { field: "duration", headerName: "Длительность", width: 120 },
    { field: "coach_id", headerName: "ID тренера", width: 120 },
    {
      field: "created_at",
      headerName: "Создано",
      width: 180,
      renderCell: (params) => <span>{formatDate(params.value as string)}</span>,
    },
    {
      field: "updated_at",
      headerName: "Обновлено",
      width: 180,
      renderCell: (params) => <span>{formatDate(params.value as string)}</span>,
    },
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
      <Typography variant="h4">Управление тренировками</Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          variant="standard"
          label="Поиск по названию"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="success" onClick={handleOpenAdd}>
          Добавить
        </Button>
      </Stack>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredTrainings}
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
            setSelectedTrainings(newSelection as number[])
          }
          getRowId={(row) => row.id}
        />
      </div>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirmOpen}
          sx={{ maxWidth: "fit-content" }}
        >
          Удалить выбранные
        </Button>
      </Stack>

      {/* Диалог добавления тренировки */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Добавить тренировку</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Название"
            fullWidth
            variant="standard"
            value={newTraining.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Описание"
            fullWidth
            variant="standard"
            value={newTraining.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="training_date"
            label="Дата тренировки (YYYY-MM-DDTHH:MM:SSZ)"
            fullWidth
            variant="standard"
            value={newTraining.training_date}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Локация"
            fullWidth
            variant="standard"
            value={newTraining.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Длительность (мин)"
            fullWidth
            variant="standard"
            value={newTraining.duration}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="coach_id"
            label="ID тренера"
            fullWidth
            variant="standard"
            value={newTraining.coach_id}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Отмена</Button>
          <Button onClick={handleAddTraining} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить выбранные тренировки?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Отмена</Button>
          <Button onClick={handleDeleteTrainings} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования тренировки */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Редактировать тренировку</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Название"
            fullWidth
            variant="standard"
            value={editTraining?.title || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Описание"
            fullWidth
            variant="standard"
            value={editTraining?.description || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="training_date"
            label="Дата тренировки (YYYY-MM-DDTHH:MM:SSZ)"
            fullWidth
            variant="standard"
            value={editTraining?.training_date || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Локация"
            fullWidth
            variant="standard"
            value={editTraining?.location || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Длительность (мин)"
            fullWidth
            variant="standard"
            value={editTraining?.duration || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="coach_id"
            label="ID тренера"
            fullWidth
            variant="standard"
            value={editTraining?.coach_id || ""}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Отмена</Button>
          <Button onClick={handleUpdateTraining} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
