export interface Project {
  id?: string;
  name: string;
  tech: string;
  status: "Planned" | "In Progress" | "Completed";
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  ownerEmail?: string;
}
