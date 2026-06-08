import { readFile, access, lstat, readlink } from "node:fs/promises";

const requiredFiles = [
  "SKILL.md",
  "assets/cli-panel.html",
  "LICENSE",
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  "plugins/html-as-cli-panel-skill/.claude-plugin/plugin.json",
  "plugins/html-as-cli-panel-skill/.codex-plugin/plugin.json",
  "plugins/html-as-cli-panel-skill/skills/cli-panel/SKILL.md",
  "plugins/html-as-cli-panel-skill/skills/cli-panel/assets/cli-panel.html",
  "skills/cli-panel",
  "assets/cli-panel.html"
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

async function assertJson(path) {
  const raw = await readFile(path, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${path} must contain valid JSON: ${error.message}`);
  }
}

async function assertSymlink(path, expectedTarget) {
  const stats = await lstat(path);
  if (!stats.isSymbolicLink()) {
    throw new Error(`${path} must be a symlink`);
  }

  const target = await readlink(path);
  if (target !== expectedTarget) {
    throw new Error(`${path} must point to ${expectedTarget}`);
  }
}

async function assertSkillEntrypoints() {
  await assertSymlink("SKILL.md", "plugins/html-as-cli-panel-skill/skills/cli-panel/SKILL.md");
  await assertSymlink(
    "assets/cli-panel.html",
    "../plugins/html-as-cli-panel-skill/skills/cli-panel/assets/cli-panel.html"
  );
  await assertSymlink("skills/cli-panel", "../plugins/html-as-cli-panel-skill/skills/cli-panel");
  await access("skills/cli-panel/SKILL.md");
  await access("skills/cli-panel/assets/cli-panel.html");
}

async function assertPluginMetadata() {
  const codexPlugin = await assertJson("plugins/html-as-cli-panel-skill/.codex-plugin/plugin.json");
  if (codexPlugin.name !== "html-as-cli-panel-skill") {
    throw new Error("Codex plugin name must be html-as-cli-panel-skill");
  }
  if (codexPlugin.skills !== "./skills/") {
    throw new Error("Codex plugin skills path must point to ./skills/");
  }

  const codexMarketplace = await assertJson(".agents/plugins/marketplace.json");
  const codexEntry = codexMarketplace.plugins?.[0];
  if (codexEntry?.source?.path !== "./plugins/html-as-cli-panel-skill") {
    throw new Error("Codex marketplace source.path must be ./plugins/html-as-cli-panel-skill");
  }

  const claudePlugin = await assertJson("plugins/html-as-cli-panel-skill/.claude-plugin/plugin.json");
  if (claudePlugin.name !== "html-as-cli-panel-skill") {
    throw new Error("Claude plugin name must be html-as-cli-panel-skill");
  }

  const claudeMarketplace = await assertJson(".claude-plugin/marketplace.json");
  const claudeEntry = claudeMarketplace.plugins?.[0];
  if (claudeEntry?.source !== "./plugins/html-as-cli-panel-skill") {
    throw new Error("Claude plugin marketplace source must be ./plugins/html-as-cli-panel-skill");
  }
}

for (const file of requiredFiles) {
  await assertFile(file);
}

const skill = await readFile("SKILL.md", "utf8");
assertFrontmatter(parseFrontmatter(skill));
await assertTemplate();
await assertSkillEntrypoints();
await assertPluginMetadata();

console.log("Skill package validation passed.");
