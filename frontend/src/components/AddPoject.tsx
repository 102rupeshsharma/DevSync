import React, { useEffect, useState } from "react";
import type { Project } from '../Interfaces/project';
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { addProject, updateProject } from "../store/projectSlice";
import { Box, TextField, Button, Paper, Typography, MenuItem } from '@mui/material';
import { v4 as uuidv4 } from "uuid";

interface Props {
  projectToEdit?: Project | null;
  clearEdit: () => void;
}

export const AddProject: React.FC<Props> = ({ projectToEdit, clearEdit }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<Project>({
    id: '',
    name: '',
    tech: '',
    description: '',
    status: 'Planned',
    url: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (projectToEdit) {
      setFormData(projectToEdit);
    }
  }, [projectToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectToEdit) {
      dispatch(updateProject(formData));
      clearEdit();
    } else {
      dispatch(addProject({ ...formData, id: uuidv4() }));
    }
    setFormData({
      id: '',
      name: '',
      tech: '',
      description: '',
      status: 'Planned',
      url: '',
      startDate: '',
      endDate: ''
    });
  };

  const commonStyles = {
    input: { color: 'white' },
    label: { color: 'white' },
    '& label.Mui-focused': { color: '#1E88E5' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'gray' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: '#1E88E5' },
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '800px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 650,
          bgcolor: '#171d22',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.4)'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: 3,
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          {projectToEdit ? 'Edit Project' : 'Add New Project'}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <TextField
            label="Project Name"
            name="name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={commonStyles}
          />

          <TextField
            label="Tech Stack"
            name="tech"
            variant="outlined"
            value={formData.tech}
            onChange={handleChange}
            fullWidth
            sx={commonStyles}
          />

          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              ...commonStyles,
              '& .MuiInputBase-root': { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'gray',
              },
            }}
          >
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <TextField
            label="Description"
            name="description"
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiInputBase-root textarea': {
                color: 'white',
              },
              ...commonStyles,
            }}
          />

          {/* Show only if status is "Completed" */}
          {formData.status === "Completed" && (
            <>
              <TextField
                label="Project URL"
                name="url"
                variant="outlined"
                value={formData.url}
                onChange={handleChange}
                fullWidth
                sx={commonStyles}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={commonStyles}
                />

                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={commonStyles}
                />
              </Box>
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 1,
              bgcolor: '#1E88E5',
              fontWeight: 600,
              letterSpacing: 1,
              '&:hover': {
                bgcolor: '#1565C0',
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
