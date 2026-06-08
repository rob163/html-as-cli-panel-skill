# HTML as CLI Panel Skill

An agent skill for creating a static, copy-only HTML command panel from a
project's repeat-use CLI workflows.

The generated `cli-panel.html` runs locally in the browser, stores edits in
`localStorage`, and helps users build copyable commands without adding runtime
dependencies to the target project.

<p align="center">
  <a href="./docs/demo/cli-panel.html">
    <img src="./docs/images/cli-panel-preview.png" alt="CLI Panel template preview" width="100%">
  </a>
</p>

<p align="center">
  <a href="./docs/demo/cli-panel.html"><strong>Open the template HTML demo</strong></a>
</p>

## Install

Use the `skills` installer so the target agent receives the correct directory
layout. This avoids fragile file-placement mistakes.

Install with automatic agent detection:

```bash
npx skills add rob163/html-as-cli-panel-skill
```

Install for Codex:

```bash
npx skills add rob163/html-as-cli-panel-skill --agent codex
```

Install for Claude Code:

```bash
npx skills add rob163/html-as-cli-panel-skill --agent claude-code
```

Install globally instead of project-local:

```bash
npx skills add rob163/html-as-cli-panel-skill --global
```

Private repository installs require GitHub authentication in the environment
running `npx skills`.

Before the repository is published, test this local clone through the same
installer path:

```bash
npx skills add . --agent codex
```

## How It Works

The installer finds `SKILL.md`, then links or copies the whole skill package into
the target agent's skill directory. For Codex and Claude Code, the portable
contract is the same: a skill folder with `SKILL.md` plus bundled resources.

Codex does not need `agents/openai.yaml` to create `cli-panel.html`. When the
skill triggers, Codex reads the workflow in `SKILL.md` and uses the bundled
`assets/cli-panel.html` template from the installed skill folder.

`description` stays self-contained because Codex uses it for implicit skill
matching. `when_to_use` is optional ecosystem metadata used by agents and
registries that support it, including Claude Code-style skill listings. The
skill does not depend on `when_to_use` being read.

## Package Layout

```text
.
├── SKILL.md
├── assets/cli-panel.html
└── docs/
```

`SKILL.md` is the portable skill entrypoint used by agents and registries such as
[skills.sh](https://www.skills.sh/). `assets/cli-panel.html` is the template the
agent copies into target projects.

This repository intentionally does not include agent-specific UI metadata such as
`agents/openai.yaml`. The skill package should stay portable. If a future Codex
plugin or marketplace wrapper is needed, add it as an adapter around the same
`SKILL.md` and `assets/` directory rather than making the core skill Codex-only.

## Development

Validate the skill package:

```bash
npm run validate
```

This repository intentionally has no runtime dependencies. The validation script
checks the required skill metadata and bundled template files.

## License

MIT
