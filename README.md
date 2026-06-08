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

## Development

Validate the skill package:

```bash
npm run validate
```

This repository intentionally has no runtime dependencies. The validation script
checks the required skill metadata and bundled template files.

## License

MIT
