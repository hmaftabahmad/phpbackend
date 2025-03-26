import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  Box
} from '@mui/material';

const SimpleUserRoleForm = () => {
  const SERVER_URL = "http://localhost:80/dashboard";
  const [moduleOptions, setModuleOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [user, setUser] = useState('');
  const [department, setDepartment] = useState('');
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get(`${SERVER_URL}/api/getAllUsers.php?token=allUsers`);
        setUsers(usersRes.data);

        const modulesRes = await axios.get(`${SERVER_URL}/api/getRoles.php`);
        setModuleOptions(modulesRes.data);

        const categoriesRes = await axios.get(`${SERVER_URL}/api/getCategories.php`);
        setCategoryOptions(categoriesRes.data);

        const departmentsRes = await axios.get(`${SERVER_URL}/api/getDepartments.php`);
        setDepartments(departmentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${SERVER_URL}/api/setRoles.php`, {
        user,
        department,
        modules,
        categories,
      });
      alert('Role saved successfully!');
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save the role.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>User Role Management</Typography>

      {/* User Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Select User</InputLabel>
        <Select
          value={user}
          onChange={(e) => setUser(e.target.value)}
          input={<OutlinedInput label="Select User" />}
        >
          {users.map((u) => (
            <MenuItem key={u.user_id} value={u.name}>
              {u.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Department Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Department</InputLabel>
        <Select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          input={<OutlinedInput label="Select Department" />}
        >
          {departments.map((d) => (
            <MenuItem key={d.department_id} value={d.name}>
              {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Modules Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Module Permissions</InputLabel>
        <Select
          multiple
          value={modules}
          onChange={(e) => setModules(e.target.value)}
          input={<OutlinedInput label="Module Permissions" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {moduleOptions.map((module) => (
            <MenuItem key={module.id} value={module.name}>
              {module.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Categories Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Category Permissions</InputLabel>
        <Select
          multiple
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          input={<OutlinedInput label="Category Permissions" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {categoryOptions.map((category) => (
            <MenuItem key={category.category_id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Save Role
        </Button>
      </Box>
    </Container>
  );
};

export default SimpleUserRoleForm;
