import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import VideocamIcon from "@mui/icons-material/Videocam";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAuth } from "../utils/auth/useAuth";
import { AccountCircleOutlined, Home } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerItems1 = [
    {
      title: "Главная",
      icon: <Home />,
      onClick: () => {
        navigate("/");
      },
    },
    {
      title: "Поток",
      icon: <VideocamIcon />,
      onClick: () => {
        navigate("/stream");
      },
    },
  ];
  const DrawerItems2 =
    isAuthenticated && role === "Администратор"
      ? [
          {
            title: "Администрирование",
            icon: <ManageAccountsIcon sx={{ color: "blue" }} />,
            color: "blue",
            onClick: () => {
              navigate("/admin");
            },
          },
          {
            title: "Выйти из аккаунта",
            icon: <ExitToAppIcon sx={{ color: "red" }} />,
            color: "red",
            onClick: () => {
              logout();
            },
          },
        ]
      : [
          {
            title: "Выйти из аккаунта",
            icon: <ExitToAppIcon sx={{ color: "red" }} />,
            color: "red",
            onClick: () => {
              logout();
            },
          },
        ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {DrawerItems1.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {DrawerItems2.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={item.onClick} sx={{ color: item.color }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ХК «Паровоз»
          </Typography>

          {isAuthenticated ? (
            <Button
              variant="contained"
              color="info"
              startIcon={<AccountCircleOutlined />}
            >
              Профиль
            </Button>
          ) : (
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              Войти
            </Button>
          )}
        </Toolbar>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </AppBar>
    </Box>
  );
}
