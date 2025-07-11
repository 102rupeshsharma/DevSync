import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../Interfaces/project";
// import { v4 as uuidv4 } from "uuid";

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

// 1. Fetch all projects
export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:10000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch projects");

      const rawData = await res.json();
      const data: Project[] = rawData.map((project: any) => ({
        ...project,
        id: project._id,
      }));

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Fetch failed");
    }
  }
);


// 2. Add new project (only send to backend, no UI change here)
export const addProjectAsync = createAsyncThunk(
  "project/addProjectAsync",
  async ({ project, token }: { project: Project; token: string }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:10000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error("Failed to add project");

      const newProject = await res.json();

      return {
        ...project,
        id: newProject.project_id, // Use real MongoDB ID
      };
    } catch (err) {
      return thunkAPI.rejectWithValue("Add project failed");
    }
  }
);

// 3. Update project
export const updateProjectAsync = createAsyncThunk(
  "project/updateProjectAsync",
  async ({ project, token }: { project: Project; token: string }, thunkAPI) => {
    try {
      const { id, ...rest } = project;
      const res = await fetch(`http://localhost:10000/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return project;
    } catch (err) {
      return thunkAPI.rejectWithValue("Update project failed");
    }
  }
);


// 4. Delete project
export const deleteProjectAsync = createAsyncThunk(
  "project/deleteProjectAsync",
  async ({ id, token }: { id: string; token: string }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:10000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete project");
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Delete project failed");
    }
  }
);

// 🔧 Slice
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    // ⏱ Optimistic Add: show in UI immediately
    addProjectOptimistic: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },

    updateProject: (state, action: PayloadAction<Project>) => {
      const idx = state.projects.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
    },

    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ DO NOT push again in addProjectAsync
      .addCase(addProjectAsync.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(
          (p) => p.id === action.meta.arg.project.id
        );
        if (idx !== -1) {
          state.projects[idx].id = action.payload.id; // Replace temp ID with Mongo _id
        }
      })

      // Update
      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
      })

      // Delete
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      });
  },
});

// Export
export const {
  addProjectOptimistic,
  updateProject,
  deleteProject,
} = projectSlice.actions;
export default projectSlice.reducer;
