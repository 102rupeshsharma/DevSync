import { useState } from 'react'
import { DashBoard } from '../components/Dashboard'
import { AddProject } from '../components/AddPoject';
import { Settings } from '../components/Settings';
import type { Project } from '../Interfaces/project';

export const Home = () => {
    const [activePage, setActivePage] = useState<String>("dashBoard");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const renderComponent = () => {
        switch (activePage) {
            case 'dashBoard': return <DashBoard/>;
            case 'addProject': return <AddProject projectToEdit={selectedProject} clearEdit={() => setSelectedProject(null)} />;
            case 'settings': return <Settings />
            default: return <DashBoard />;
        }
    }
    return (
        <>
            <div className="flex">
                <div className="bg-[#171d22] w-[300px] h-screen flex flex-col border-r ">
                    <div className="font-Pacifico text-blue-800 text-5xl flex justify-center items-center h-20">
                        <p>DevSync</p>
                    </div>

                    <div className=" text-3xl p-5 flex flex-col items-center gap-4">
                        <button onClick={() => setActivePage('dashBoard')} className="my-2 mx-2 p-2 rounded-2xl w-full border-1 border-gray-500 shadow-md shadow-black text-white cursor-pointer">DashBoard</button>
                        <button onClick={() => setActivePage('addProject')} className="my-2 mx-2 p-2 rounded-2xl w-full border-1 border-gray-500 shadow-md shadow-black text-white cursor-pointer">Add Project</button>
                        <button onClick={() => setActivePage('settings')} className="my-2 mx-2 p-2 rounded-2xl w-full border-1 border-gray-500 shadow-md shadow-black text-white cursor-pointer">Settings</button>
                    </div>

                    <div className="mt-auto p-4 mb-10 text-center border bg-amber-200">
                        Login
                    </div>
                </div>

                <div className="flex justify-center  size-full h-screen bg-[#13181C] text-white">
                    {renderComponent()}
                </div>
            </div>
        </>
    )
}