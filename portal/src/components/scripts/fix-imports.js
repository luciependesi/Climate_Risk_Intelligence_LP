// scripts/fix-imports.js
// Auto-fixes all imports from src/components to use default imports.

import fs from "fs";
import path from "path";

const COMPONENT_DIR = path.resolve("src/components");
const PROJECT_ROOT = path.resolve("src");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, callback);
    else callback(full);
  });
}

function fixImports(file) {
  let code = fs.readFileSync(file, "utf8");
  let changed = false;

  // Match: import { Something } from "../components/Something"
  const regex =
    /import\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*["'](\.\.\/components\/[^"']+)["']/g;

  code = code.replace(regex, (match, name, path) => {
    changed = true;
    return `import ${name} from "${path}"`;
  });

  if (changed) {
    fs.writeFileSync(file, code, "utf8");
    console.log("✔ Fixed imports in:", file);
  }
}

walk(PROJECT_ROOT, (file) => {
  if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
    fixImports(file);
  }
});