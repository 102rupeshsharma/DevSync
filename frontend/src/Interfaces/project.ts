export interface Project {
  id: string;
  name: string;
  tech: string;
  description: string;
  date?: string;
  status?: "Planned" | "In Progress" | "Completed";
}
