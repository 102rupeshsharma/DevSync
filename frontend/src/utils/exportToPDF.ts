import jsPDF from "jspdf";
import type { Project } from "../Interfaces/project";

export const exportProjectsToPDF = (projects: Project[]) => {
  const doc = new jsPDF();
  let y = 20;
  const margin = 14;

  // 🔵 Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(33, 150, 243); // Blue
  doc.text("DevSync Project Report", margin, y);
  y += 12;

  projects.forEach((proj, index) => {
    const lineHeight = 7;
    const spacing = 10;

    const descriptionLines = doc.splitTextToSize(`Description : ${proj.description || "N/A"}`, 180);
    const blockHeight = (6 + descriptionLines.length) * lineHeight + spacing;
    

    if (y + blockHeight > 280) {
      doc.addPage();
      y = 20;
    }

    // 🟡 Project Title
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Project ${index + 1}`, margin, y);
    y += lineHeight;

    doc.setFont("helvetica", "normal");

    doc.text(`Name        : ${proj.name || "N/A"}`, margin, y); y += lineHeight;
    doc.text(`Tech Stack  : ${proj.tech || "N/A"}`, margin, y); y += lineHeight;

    // 🔴 Status with color
    const statusColor =
      proj.status === "Completed" ? [76, 175, 80] :
      proj.status === "In Progress" ? [255, 193, 7] : [33, 150, 243];

    doc.setTextColor(...(statusColor as [number, number, number]));
    doc.text(`Status      : ${proj.status || "N/A"}`, margin, y);

    y += lineHeight;

    doc.setTextColor(0, 0, 0); // Reset to black
    doc.text(descriptionLines, margin, y);
    y += descriptionLines.length * lineHeight;

    const start = proj.status === "Completed" ? proj.startDate || "Not specified" : "Not started yet";
    const end = proj.status === "Completed" ? proj.endDate || "Not specified" : "Not started yet";
    const url = proj.status === "Completed" ? proj.url || "Not hosted" : "Not hosted yet";

    doc.text(`Start Date  : ${start}`, margin, y); y += lineHeight;
    doc.text(`End Date    : ${end}`, margin, y); y += lineHeight;
    doc.text(`Hosted URL  : ${url}`, margin, y); y += lineHeight;

    // 🧾 Line separator
    doc.setDrawColor(180); // light gray
    doc.line(margin, y, 195, y);
    y += spacing;
  });

  // 📄 Page numbers (optional)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 200, 290, { align: "right" });
  }

  doc.save("DevSync_Projects.pdf");
};
