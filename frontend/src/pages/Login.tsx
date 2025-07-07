import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    CircularProgress,
} from '@mui/material';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            
            navigate('/'); 
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
                    Login to <span style={{ color: '#2d63d9' }}>DevSync</span>
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
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
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
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
                    Don't have an account?{' '}
                    <a href="/signup" style={{ color: '#2d63d9', fontWeight: 500 }}>
                        Sign up
                    </a>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Login;
