import { readFile, access } from "node:fs/promises";

const requiredFiles = [
  "SKILL.md",
  "assets/cli-panel.html",
  "LICENSE"
];

async function assertFile(path) {
  try {
    await access(path);
  } catch {
    throw new Error(`Missing required file: ${path}`);
  }
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    throw new Error("SKILL.md must start with YAML frontmatter");
  }

  const fields = new Map();
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([a-zA-Z0-9_-]+):(?:\s*(.*))?$/);
    if (field) {
      fields.set(field[1], field[2] ?? "");
    }
  }
  return fields;
}

function assertFrontmatter(fields) {
  const required = ["name", "description", "version", "author"];
  for (const key of required) {
    if (!fields.has(key)) {
      throw new Error(`SKILL.md frontmatter missing required field: ${key}`);
    }
  }

  const name = fields.get("name");
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error("SKILL.md name must use lowercase letters, numbers, and hyphens");
  }

  const version = fields.get("version");
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error("SKILL.md version must use semver, for example 0.1.0");
  }
}

async function assertTemplate() {
  const html = await readFile("assets/cli-panel.html", "utf8");
  const checks = [
    ["HTML as CLI Panel", "template eyebrow/title text"],
    ["const storageKey", "storageKey definition"],
    ["const defaultsKey", "defaultsKey definition"],
    ["defaultState", "defaultState definition"],
    ["commands", "default commands field"]
  ];

  for (const [needle, label] of checks) {
    if (!html.includes(needle)) {
      throw new Error(`assets/cli-panel.html missing ${label}`);
    }
  }
}

for (const file of requiredFiles) {
  await assertFile(file);
}

const skill = await readFile("SKILL.md", "utf8");
assertFrontmatter(parseFrontmatter(skill));
await assertTemplate();

console.log("Skill package validation passed.");
