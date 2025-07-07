import { useEffect, useState } from 'react';
import { DashBoard } from '../components/Dashboard';
import { AddProject } from '../components/AddPoject';
import { Settings } from '../components/Settings';
import type { Project } from '../Interfaces/project';
import UserIcon from '../assets/User-icon.png';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState<string>('dashBoard');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [user, setUser] = useState<{ username: string } | null>(null);

    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const renderComponent = () => {
        switch (activePage) {
            case 'dashBoard':
                return <DashBoard />;
            case 'addProject':
                return (
                    <AddProject
                        projectToEdit={selectedProject}
                        clearEdit={() => setSelectedProject(null)}
                    />
                );
            case 'settings':
                return <Settings />;
            default:
                return <DashBoard />;
        }
    };

    return (
        <div className="flex">
            <div className="bg-[#171d22] w-[300px] h-screen flex flex-col border-r">
                <div className="font-Pacifico text-blue-800 text-5xl flex justify-center items-center h-20">
                    <p>DevSync</p>
                </div>

                <div className="text-3xl p-5 flex flex-col items-center gap-4">
                    <button
                        onClick={() => setActivePage('dashBoard')}
                        className="my-2 mx-2 p-2 rounded-2xl w-full border border-gray-500 shadow-md shadow-black text-white cursor-pointer"
                    >
                        DashBoard
                    </button>
                    <button
                        onClick={() => setActivePage('addProject')}
                        className="my-2 mx-2 p-2 rounded-2xl w-full border border-gray-500 shadow-md shadow-black text-white cursor-pointer"
                    >
                        Add Project
                    </button>
                    <button
                        onClick={() => setActivePage('settings')}
                        className="my-2 mx-2 p-2 rounded-2xl w-full border border-gray-500 shadow-md shadow-black text-white cursor-pointer"
                    >
                        Settings
                    </button>
                </div>

                <div className="relative mt-auto mb-10 text-center mx-5">
                    {!user ? (
                        <div
                            onClick={() => navigate('/signup')}
                            className="flex justify-center gap-3 rounded-2xl border border-gray-500 shadow-md shadow-black text-white cursor-pointer p-4 transition duration-300 hover:bg-[#2d63d9]"
                        >
                            <img className="w-8 h-8" src={UserIcon} alt="user-icon" />
                            <span className="text-3xl font-bold text-white">Login</span>
                        </div>
                    ) : (
                        <div className="relative group">
                            <div
                                onClick={handleLogout}
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-full bg-[#2d63d9] text-white text-lg font-medium px-4 py-3 rounded-t-2xl opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300 origin-bottom hover:bg-[#1f4bb8]"
                            >
                                Logout
                            </div>

                            <div className="flex justify-center items-center gap-3 border border-gray-500 shadow-md shadow-black text-white px-4 py-3 transition duration-300 rounded-2xl group-hover:rounded-t-none bg-[#171d22] cursor-pointer">
                                <img className="w-8 h-8" src={UserIcon} alt="user-icon" />
                                <span className="text-2xl font-bold text-white truncate max-w-[150px] overflow-hidden whitespace-nowrap block">
                                    {user.username}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center size-full h-screen bg-[#13181C] text-white">
                {renderComponent()}
            </div>
        </div>
    );
};
