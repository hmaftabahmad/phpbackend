import React, { useState,useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRoleForm from "./addNewRole";
import {useNavigate} from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
} from "@mui/material";

export default function EnhancedUsers() {
  const SERVER_URL = "http://localhost:80/dashboard";
  const queryClient = useQueryClient();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading state
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  useEffect( () => {
  axios.get(`${SERVER_URL}/api/getAllUsers.php?token=allUsers`)
      .then((response) => {
          setUsers(response.data);
          setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          setIsLoading(false); // Set loading to false even if there's an error
      });
  }, []);





  const deleteUser = useMutation({
    
    mutationFn: async (userId) =>
      await axios.delete(`${SERVER_URL}/api/deleteUser.php?endpoint=deleteUser&user_id=${userId}`),
    
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      toast.success("User deleted successfully!");
    },
    onError: (error) => toast.error("Failed to delete user."),
  });

  const updateUser = useMutation({
    
    mutationFn: async (updatedUser) => {
            return await axios.post(
        `${SERVER_URL}/api/updateUser.php?user_id=${updatedUser.user_id}`,
        updatedUser,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      queryClient.refetchQueries("users");
      setIsEditing(false);
      setSelectedUser(null);
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      console.error("Update Error:", error); // Log error
      toast.error("Failed to update user.");
    },
  });
  
  

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(userId);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    updateUser.mutate(selectedUser);
  };

  const handleFormChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };
  const addUser = useMutation({
    mutationFn: async (newUser) =>
      await axios.post(`${SERVER_URL}/api/addUser.php`, newUser),
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setIsAdding(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
      });
      toast.success("User added successfully!", { autoClose: 1000 });
    },
    onError: () => toast.error("Failed to add user."),
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    addUser.mutate(newUser);
  };

  const handleFormChange1 = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <>
      <div className="p-4">
        <ToastContainer />
        <AppBar position="static" color="primary" sx={{ }}>
      <Toolbar>
        <Typography variant="h3" component="h1" sx={{ flexGrow: 1,textAlign:'center' }}>
          User Management
        </Typography>
      </Toolbar>
    </AppBar>
        <>
        <Button variant="contained" color="primary" onClick={() => navigate('/products')}>Products</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleButtonClick}
            sx={{
              margin: "10px",
            }}
          >
            {showForm ? "Cancel" : "Assign Role to User"}
          </Button>

          {showForm && <UserRoleForm />}
        </>
        <Button
          variant="contained"
          color="success"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? "Cancel" : "Add User"}
        </Button>

        {isAdding && (
          <Box
            component="form"
            onSubmit={handleAddUser}
            sx={{
              mb: 4,
              p: 4,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <TextField
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleFormChange1}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleFormChange1}
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
            />
            <TextField
              label="First Name"
              name="first_name"
              value={newUser.first_name}
              onChange={handleFormChange1}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={newUser.last_name}
              onChange={handleFormChange1}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              value={newUser.password}
              onChange={handleFormChange1}
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Save User
            </Button>
          </Box>
        )}

        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Staff Members
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id} hover>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(user)}
                      sx={{ marginRight: 1 }}
                    >
                      <EditIcon/>
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(user.user_id)}
                    >
                      <DeleteIcon/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {isEditing && (
          <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  label="Username"
                  name="username"
                  value={selectedUser.username}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={selectedUser.email}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="First Name"
                  name="first_name"
                  value={selectedUser.first_name}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={selectedUser.last_name}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <DialogActions>
                  <Button type="submit" variant="contained" color="success">
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="contained"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
