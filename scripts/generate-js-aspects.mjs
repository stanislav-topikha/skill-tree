import fs from "node:fs";
import path from "node:path";

const rawPath = path.join("data", "subject_js.raw.json");
const outPath = path.join("data", "subject_js.aspects.json");

// title -> snake_case segment (same as convert-js-subject.mjs)
function toSnake(title, isTopLevel = false) {
  let s = title;
  if (isTopLevel) {
    // strip numeric prefix like "00_" or "14_"
    s = s.replace(/^[0-9]+_/, "");
  }
  return s.replace(/-/g, "_");
}

function collectAspects(nodes, pathParts = [], depth = 0, map = {}) {
  nodes.forEach((node) => {
    const isTopLevel = depth === 0;
    const seg = toSnake(node.title, isTopLevel);
    const pathSegments = [...pathParts, seg];

    const hasChildren = node.children && node.children.length > 0;
    const id = "js_" + pathSegments.join("_");

    if (hasChildren) {
      collectAspects(node.children, pathSegments, depth + 1, map);
      return;
    }

    // endpoint
    if (node.difficulty != null) {
      map[id] = { difficulty: Number(node.difficulty) };
    }
  });

  return map;
}

const rawText = fs.readFileSync(rawPath, "utf8");
const rawArray = JSON.parse(rawText);

const aspectMap = collectAspects(rawArray);

fs.writeFileSync(outPath, JSON.stringify(aspectMap, null, 2), "utf8");
console.log("Wrote", outPath);
