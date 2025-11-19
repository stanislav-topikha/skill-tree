import fs from "node:fs";
import path from "node:path";

const rawPath = path.join("data", "subject_js.raw.json");
const outPath = path.join("data", "subject_js.json");

// title -> snake_case segment
function toSnake(title, isTopLevel = false) {
  let s = title;
  if (isTopLevel) {
    // strip numeric prefix like "00_" or "14_"
    s = s.replace(/^[0-9]+_/, "");
  }
  return s.replace(/-/g, "_");
}

// prettier label for UI
function prettifyLabel(title) {
  const noNum = title.replace(/^[0-9]+_/, "");
  return noNum
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/**
 * Convert legacy nodes into new spec:
 *  - kind: "group" or "endpoint"
 *  - id: "js_" + snake_case_path
 *  - title: original slug
 *  - label: pretty for UI
 *  - NO difficulty in tree
 */
function convertNodes(nodes, pathParts = [], depth = 0) {
  return nodes.map((node) => {
    const isTopLevel = depth === 0;
    const seg = toSnake(node.title, isTopLevel);
    const pathSegments = [...pathParts, seg];

    const hasChildren = node.children && node.children.length > 0;

    if (hasChildren) {
      const id = "js_" + pathSegments.join("_");

      return {
        id,
        kind: "group",
        title: node.title,
        label: prettifyLabel(node.title),
        children: convertNodes(node.children, pathSegments, depth + 1)
      };
    }

    const id = "js_" + pathSegments.join("_");

    return {
      id,
      kind: "endpoint",
      title: node.title,
      label: prettifyLabel(node.title)
    };
  });
}

const rawText = fs.readFileSync(rawPath, "utf8");
const rawArray = JSON.parse(rawText);

const convertedRoot = convertNodes(rawArray);

const subject = {
  subject: {
    id: "js",
    title: "JavaScript",
    root: convertedRoot
  }
};

fs.writeFileSync(outPath, JSON.stringify(subject, null, 2), "utf8");
console.log("Wrote", outPath);
