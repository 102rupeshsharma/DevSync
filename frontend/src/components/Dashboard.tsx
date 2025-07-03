// ...imports
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { AppDispatch, RootState } from "../store/store";
import type { Project } from "../Interfaces/project";
import { deleteProject } from "../store/projectSlice";
import { AddProject } from "./AddPoject";

export const DashBoard = () => {
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch<AppDispatch>();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const totalProjects = projects.length;
  const allTechs = projects.flatMap(p =>
    p.tech.split(',').map(tech => tech.trim().toLowerCase())
  );
  const uniqueTechs = Array.from(new Set(allTechs));

  const techFrequency: { [key: string]: number } = {};
  allTechs.forEach(tech => {
    techFrequency[tech] = (techFrequency[tech] || 0) + 1;
  });

  const mostUsedTech = Object.entries(techFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const handleDelete = (id: string) => dispatch(deleteProject(id));
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const filteredProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "tech") return a.tech.localeCompare(b.tech);
      if (sortOption === "status") {
        const order = ["In Progress", "Planned", "Completed"];
        const statusA = a.status ?? "";
        const statusB = b.status ?? "";
        return order.indexOf(statusA) - order.indexOf(statusB);
      }
      return 0;
    });


  return (
    <div className="p-8 text-white w-full relative">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
        <h2 className="text-4xl font-bold">All Projects</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 bg-[#1A1F23] border border-gray-600 rounded text-white"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 bg-[#1A1F23] border border-gray-600 rounded text-white"
          >
            <option value="name">Sort by Name</option>
            <option value="tech">Sort by Tech</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-gray-400 text-center">No projects found.</p>
      ) : (
        <div
          style={{
            backgroundColor: "#13181C",
            color: "#ffffff",
            padding: "1rem",
            borderRadius: "10px"
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1A1F23] p-4 rounded-lg text-center border border-gray-600">
              <h4 className="text-lg font-semibold mb-1">Total Projects</h4>
              <p className="text-2xl font-bold text-blue-500">{totalProjects}</p>
            </div>
            <div className="bg-[#1A1F23] p-4 rounded-lg text-center border border-gray-600">
              <h4 className="text-lg font-semibold mb-1">Most Used Tech</h4>
              <p className="text-2xl font-bold text-green-400 capitalize">{mostUsedTech}</p>
            </div>
            <div className="bg-[#1A1F23] p-4 rounded-lg text-center border border-gray-600">
              <h4 className="text-lg font-semibold mb-1">Unique Technologies</h4>
              <p className="text-2xl font-bold text-amber-400">{uniqueTechs.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj, index) => (
              <div
                key={index}
                className="border border-gray-600 rounded-xl p-5 bg-[#1A1F23] shadow-md"
              >
                <h3 className="text-xl font-semibold mb-2">{proj.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  <span className="font-medium">Tech:</span>
                  {proj.tech.split(',').map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-blue-300 text-xs font-semibold px-2 py-1 rounded border border-blue-500"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                <p className="text-sm mb-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      proj.status === "Completed"
                        ? "text-green-400"
                        : proj.status === "In Progress"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }
                  >
                    {proj.status}
                  </span>
                </p>
                <p className="text-gray-300 mb-3 break-words whitespace-pre-wrap">{proj.description}</p>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="px-4 py-1 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="px-4 py-1 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && editingProject && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-white/5 z-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div className="bg-transparent" onClick={(e) => e.stopPropagation()}>
            <AddProject projectToEdit={editingProject} clearEdit={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};
