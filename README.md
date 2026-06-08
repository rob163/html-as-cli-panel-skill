# HTML as CLI Panel Skill

An agent skill for creating a static, copy-only HTML command panel from a
project's repeat-use CLI workflows.

<p align="center">
  <a href="https://skills.sh/rob163/html-as-cli-panel-skill"><img alt="skills.sh" src="https://skills.sh/b/rob163/html-as-cli-panel-skill"></a>
  <a href="https://github.com/rob163/html-as-cli-panel-skill/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/rob163/html-as-cli-panel-skill?style=flat-square"></a>
</p>

The generated `cli-panel.html` runs locally in the browser, stores edits in
`localStorage`, and helps users build copyable commands without adding runtime
dependencies to the target project.

<p align="center">
  <a href="https://rob163.github.io/html-as-cli-panel-skill/demo/cli-panel.html">
    <img src="./docs/images/cli-panel-preview.png" alt="CLI Panel template preview" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://rob163.github.io/html-as-cli-panel-skill/demo/cli-panel.html"><strong>Open the live template demo</strong></a>
</p>

## Install

[skills](https://skills.sh) is the CLI for the open agent skills ecosystem. It
downloads a skill from a GitHub repository and places it in the directory your
coding agent expects (for example `~/.cursor/skills/` or `.codex/skills/`). You
do not need to install it separately — `npx skills` runs it on demand.

Use the installer so the target agent receives the correct layout. This avoids
fragile file-placement mistakes.

Install into the current project (shared with the repo via git):

```bash
npx skills add rob163/html-as-cli-panel-skill --agent cursor
```

Install globally for one agent (available in every project on your machine):

```bash
npx skills add rob163/html-as-cli-panel-skill --global --agent cursor
```

Replace `cursor` with your agent: `codex`, `claude-code`, and others are
supported. Omit `--agent` only if you want the CLI to auto-detect installed
agents or prompt you to choose.

Other examples:

```bash
# Codex, project-local
npx skills add rob163/html-as-cli-panel-skill --agent codex

# Claude Code, global
npx skills add rob163/html-as-cli-panel-skill --global --agent claude-code

# Skip confirmation prompts (useful in scripts)
npx skills add rob163/html-as-cli-panel-skill --global --agent cursor --yes
```

Verify installation:

```bash
npx skills ls -g -a cursor
```

## Development

Validate the skill package:

```bash
npm run validate
```

This repository intentionally has no runtime dependencies. The validation script
checks the required skill metadata and bundled template files.

## License

MIT
