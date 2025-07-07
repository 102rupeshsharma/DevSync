import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../Interfaces/project";
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
    projects: Project[]
}

const initialState: ProjectState = {
    projects: [
        {
            id: '1',
            name: "DevSync Tracker",
            tech: "React, TypeScript, Redux Toolkit",
            status: "In Progress",
            description: "A developer collaboration and project tracking platform with GitHub integration and AI summaries."
        },
        {
            id: '2',
            name: "ToDo App",
            tech: "React, TypeScript, Tailwind CSS",
            status: "Planned",
            description:
                "A simple and intuitive task management application with full CRUD functionality. Users can add, update, and delete tasks with real-time state updates using hooks."
        },
        {
            id: '3',
            name: "MeetingMind",
            tech: "FastAPI, Whisper, Hugging Face Transformers, React",
            status: "Completed",
            description: "An AI-powered meeting summarizer and emotion analyzer. Converts uploaded audio into transcriptions using Whisper, summarizes content with BART, and detects emotions via NLP models. Deployed on Hugging Face Spaces with a React frontend.",
            url: "https://meetingmind-lyart.vercel.app/",
            startDate: "2024-06-10",
            endDate: "2024-06-24"
        },
        {
            id: '4',
            name: "Resume Builder",
            tech: "React, TypeScript, HTML to PDF, Tailwind CSS",
            status: "Completed",
            description: "A customizable resume builder that allows users to input professional details and generate a formatted PDF resume. Includes live preview, export functionality, and responsive UI.",
            url: "https://cv-io.vercel.app/",
            startDate: "2024-05-05",
            endDate: "2024-05-15"
        }
    ]
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {

        addProject: (state, action: PayloadAction<Project>) => {
            const newProject = {
                ...action.payload,
                id: uuidv4(),
            }
            state.projects.push(newProject);
        },

        updateProject: (state, action: PayloadAction<Project>) => {
            const index = state.projects.findIndex(proj => proj.id === action.payload.id);
            if (index !== -1) {
                state.projects[index] = action.payload;
            }
        },

        deleteProject: (state, action: PayloadAction<string>) => {
            state.projects = state.projects.filter(project => project.id !== action.payload);
        }
    }
});

export const { addProject, updateProject, deleteProject } = projectSlice.actions
export default projectSlice.reducer