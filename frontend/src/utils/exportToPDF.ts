import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Project } from "../Interfaces/project";

export const exportProjectsToPDF = (projects: Project[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("DevSync Project Report", 14, 22);
  doc.setFontSize(12);
  doc.setTextColor(100);

  autoTable(doc, {
    startY: 30,
    head: [["Name", "Tech Stack", "Status", "Description"]],
    body: projects.map((proj) => [
      proj.name,
      proj.tech,
      proj.status ?? "N/A",
      proj.description,
    ]),
    styles: { fontSize: 10, cellWidth: "wrap" },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 80 },
    },
  });

  doc.save("DevSync_Project_Report.pdf");
};
