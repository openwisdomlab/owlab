/**
 * DXF Export Utilities
 */

import type { LayoutData } from "@/lib/ai/agents/layout-agent";

// Dynamic import for dxf-writer (client-side only)
let DxfWriter: any = null;

async function getDxfWriter() {
  if (DxfWriter) return DxfWriter;
  DxfWriter = (await import("dxf-writer")).default;
  return DxfWriter;
}

/**
 * Export layout to DXF format for CAD software
 */
export async function exportLayoutToDXF(layout: LayoutData): Promise<string> {
  const DxfWriterClass = await getDxfWriter();
  const dxf = new DxfWriterClass();

  // Set document units based on layout units
  const scaleFactor = layout.dimensions.unit === "ft" ? 304.8 : 1000; // Convert to mm

  // Add title block
  dxf.addLayer("TITLE", DxfWriterClass.ACI.CYAN, "CONTINUOUS");
  dxf.setActiveLayer("TITLE");
  dxf.drawText(
    10,
    layout.dimensions.height * scaleFactor + 20,
    10,
    0,
    layout.name
  );
  dxf.drawText(
    10,
    layout.dimensions.height * scaleFactor + 10,
    5,
    0,
    layout.description || ""
  );

  // Add dimension labels
  dxf.drawText(
    10,
    -10,
    4,
    0,
    `Dimensions: ${layout.dimensions.width} × ${layout.dimensions.height} ${layout.dimensions.unit}`
  );

  // Add border/outline layer
  dxf.addLayer("BORDER", DxfWriterClass.ACI.WHITE, "CONTINUOUS");
  dxf.setActiveLayer("BORDER");
  dxf.drawRect(
    0,
    0,
    layout.dimensions.width * scaleFactor,
    layout.dimensions.height * scaleFactor
  );

  // Create layers for each zone type
  const zoneTypes = [
    "compute",
    "workspace",
    "meeting",
    "storage",
    "utility",
    "entrance",
  ];
  const zoneColors = {
    compute: DxfWriterClass.ACI.CYAN,
    workspace: DxfWriterClass.ACI.MAGENTA,
    meeting: DxfWriterClass.ACI.GREEN,
    storage: DxfWriterClass.ACI.YELLOW,
    utility: DxfWriterClass.ACI.WHITE,
    entrance: DxfWriterClass.ACI.RED,
  };

  zoneTypes.forEach((type) => {
    dxf.addLayer(
      type.toUpperCase(),
      zoneColors[type as keyof typeof zoneColors] || DxfWriterClass.ACI.WHITE,
      "CONTINUOUS"
    );
  });

  // Draw each zone
  layout.zones.forEach((zone) => {
    const layerName = zone.type.toUpperCase();
    dxf.setActiveLayer(layerName);

    const x = zone.position.x * scaleFactor;
    const y = zone.position.y * scaleFactor;
    const width = zone.size.width * scaleFactor;
    const height = zone.size.height * scaleFactor;

    // Draw zone rectangle
    dxf.drawRect(x, y, width, height);

    // Add zone name text
    dxf.drawText(x + 5, y + height - 10, 3, 0, zone.name);

    // Add zone type
    dxf.drawText(x + 5, y + height - 15, 2, 0, `(${zone.type})`);

    // Add dimensions annotation
    dxf.drawText(
      x + 5,
      y + 5,
      2,
      0,
      `${zone.size.width}×${zone.size.height} ${layout.dimensions.unit}`
    );

    // Add equipment list if available
    if (zone.equipment && Array.isArray(zone.equipment) && zone.equipment.length > 0) {
      let equipmentText = "Equipment:";
      zone.equipment.forEach((equip: any, index: number) => {
        const equipName = typeof equip === "string" ? equip : equip.name;
        equipmentText += `\n- ${equipName}`;
        if (typeof equip === "object" && equip.quantity && equip.quantity > 1) {
          equipmentText += ` (${equip.quantity}x)`;
        }
      });
      // Add equipment as multiline text (simplified - each line separate)
      const lines = equipmentText.split("\n");
      lines.forEach((line, idx) => {
        dxf.drawText(x + 5, y + height - 20 - idx * 3, 1.5, 0, line);
      });
    }
  });

  // Add grid layer
  dxf.addLayer("GRID", DxfWriterClass.ACI.GRAY, "DASHED");
  dxf.setActiveLayer("GRID");

  // Draw grid lines
  for (let i = 0; i <= layout.dimensions.width; i++) {
    dxf.drawLine(
      i * scaleFactor,
      0,
      i * scaleFactor,
      layout.dimensions.height * scaleFactor
    );
  }
  for (let i = 0; i <= layout.dimensions.height; i++) {
    dxf.drawLine(
      0,
      i * scaleFactor,
      layout.dimensions.width * scaleFactor,
      i * scaleFactor
    );
  }

  // Add notes if available
  if (layout.notes && layout.notes.length > 0) {
    dxf.addLayer("NOTES", DxfWriterClass.ACI.YELLOW, "CONTINUOUS");
    dxf.setActiveLayer("NOTES");

    let notesY = -30;
    dxf.drawText(10, notesY, 4, 0, "Notes:");
    layout.notes.forEach((note, index) => {
      dxf.drawText(10, notesY - (index + 1) * 5, 3, 0, `${index + 1}. ${note}`);
    });
  }

  return dxf.toDxfString();
}

/**
 * Download DXF file
 */
export function downloadDXF(dxfContent: string, filename: string): void {
  const blob = new Blob([dxfContent], { type: "application/dxf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".dxf") ? filename : `${filename}.dxf`;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
