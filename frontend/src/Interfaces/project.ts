export interface Project {
  id: string;
  name: string;
  tech: string;
  description: string;
  status?: "Planned" | "In Progress" | "Completed";
  url?: string;
  startDate?: string;
  endDate?: string;
}
