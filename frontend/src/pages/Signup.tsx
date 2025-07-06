import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SignupData } from '../Interfaces/auth';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';

const Signup = () => {
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#0f1115',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 500,
          bgcolor: '#171d22',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.4)',
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
          Create <span style={{ color: '#2d63d9' }}>DevSync</span> Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              input: { color: 'white' },
              label: { color: 'white' },
              '& label.Mui-focused': { color: '#2d63d9' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: '#2d63d9' },
              },
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              input: { color: 'white' },
              label: { color: 'white' },
              '& label.Mui-focused': { color: '#2d63d9' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: '#2d63d9' },
              },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              input: { color: 'white' },
              label: { color: 'white' },
              '& label.Mui-focused': { color: '#2d63d9' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: '#2d63d9' },
              },
            }}
          />

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{
              mt: 1,
              bgcolor: '#2d63d9',
              fontWeight: 600,
              letterSpacing: 1,
              '&:hover': {
                bgcolor: '#1f4bb8',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
          </Button>

          {error && (
            <Typography variant="body2" sx={{ color: 'red', textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 4,
            color: 'gray',
            textAlign: 'center',
          }}
        >
          Already have an account?{' '}
          <a href="/login" style={{ color: '#2d63d9', fontWeight: 500 }}>
            Log in
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
