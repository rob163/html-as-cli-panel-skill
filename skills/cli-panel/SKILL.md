---
name: cli-panel
description: >
  Create or update a static localStorage-backed HTML page that turns a project's
  repeat-use CLI commands into editable, copyable command panels.
version: 0.1.0
author: rob163
license: MIT
homepage: https://github.com/rob163/html-as-cli-panel-skill
when_to_use: >
  Use when a project would benefit from a static HTML command panel for
  repeat-use CLI workflows, editable parameters, or copyable command recipes.
tags:
  - cli
  - developer-tools
  - html
  - workflow
---

# CLI Panel

## Overview

Create a static `cli-panel.html` in a target project root from
`assets/cli-panel.html`.

The page is a copy-only command builder. It stores command definitions in browser
`localStorage`, lets users edit command names, groups, effects, fixed prefixes,
and parameters, then builds copyable command strings.

## Workflow

1. Copy `assets/cli-panel.html` to the target project root unless the user
   requests another path.
2. Inspect the target project's code and files for repeat-use commands before
   filling the panel. Do not mirror every README command.
3. Replace `defaultState.commands` with a curated set. Omit one-time setup and
   trivial fixed one-liners with no meaningful parameters. Merge related setup
   steps into one card when needed.
4. Keep the eyebrow text `HTML as CLI Panel` unchanged. Replace the visible page
   title `CLI Panel` with a title that matches the target project.
5. Replace `storageKey` and `defaultsKey` with names derived from the target
   project, such as a lowercase slug, so different projects do not collide in
   browser `localStorage`.
6. Keep the template UI English unless the user asks for another language.
7. Validate the panel using the checks below.

## Command Model

Each default command must use this shape inside `defaultState.commands`:

```js
{
  type: "Workflow",
  label: "Run scenario",
  description: "What this command does and when to use it.",
  fixedText: "mytool run",
  segments: [
    { name: "--mode", value: "dry-run", widget: "text" },
    { name: "--repeat", value: "3", widget: "number" },
    { name: "", value: "./input.json", widget: "text" }
  ]
}
```

Fields:

- `type`: tab or group label, such as a workflow category.
- `label`: short command name shown as the card title.
- `description`: what the command does and when to use it.
- `fixedText`: the non-editable command prefix or complete base command.
- `segments`: editable parameters.
- `segments[].name`: option or argument label. Leave empty only for positional
  values.
- `segments[].value`: option value. Leave empty for flags that do not take a
  value.
- `segments[].widget`: use `"text"` by default, or `"number"` for numeric
  fields.

## Splitting `fixedText` and `segments`

Think in three layers:

| Layer | Goes in | Meaning |
| ----- | ------- | ------- |
| Tool family | start of `fixedText` | The main executable or entrypoint |
| Card identity | rest of `fixedText` | The shortest stable prefix that tells sibling cards apart |
| Runtime config | `segments` | Per-run values such as paths, ports, credentials, counts, and filters |

Rules:

- `fixedText` stops at the last token that is the same for every sibling card
  sharing that prefix and is not an option flag.
- Everything after the card identity belongs in `segments`, unless the whole
  command is a fixed recipe with no useful editable surface.
- Option flags are never part of card identity unless the entire flag, including
  its value when present, is non-editable.
- Keep each option together as paired segment `name` and `value`; do not split
  one flag across `fixedText` and `segments`.
- Positional arguments use an empty `name` and put the value in `value`.
- Fixed recipes can put the full command in `fixedText` and leave `segments`
  empty, but do not add a card solely because it is fixed.

Examples:

```text
# Good: card identity in fixedText; options in segments.
fixedText: python -m myapp.cli deploy
segments:  [--env, staging] [--region, us-east-1]

# Bad: split flag.
fixedText: python -m myapp.cli deploy --env
segments:  [staging]

# Good: fixed recipe.
fixedText: npm ci
segments:  []

# Good: positional argument.
fixedText: mytool import
segments:  [, ./data/input.csv]
```

When filling a real project, derive names and parameters from that project's
command definitions. Do not copy these examples into a target panel.

## Segment Order

Preview output follows `fixedText`, then `segments` in array order.

1. Put semantic segments first, such as `--mode`, `--target`, marker names, or
   sub-operation flags.
2. Put runtime configuration after semantic segments, such as paths, ports,
   credentials, and repeat counts.
3. Preserve CLI-required positional order.
4. Treat README order as reference, not law, when the target CLI accepts flexible
   flag order.

## Validation

Validation has two layers. Both matter.

### Structural Compliance

Every card must pass all checks:

- Each option is either fully in `fixedText` or fully in `segments`.
- No flag name in `fixedText` has its value in `segments`.
- Positional values use empty `name` and non-empty `value`, unless intentionally
  omitted.
- `fixedText` contains only tool family plus card identity tokens, not partial
  options.

### Semantic Equivalence

Each preview must represent the same operation as the project's documented
command, using default segment values.

Semantic equivalence does not require byte-for-byte string equality, identical
flag order when the CLI accepts reordering, or identical quoting style when both
forms are valid.

Semantic equivalence does require the same executable, module path, subcommand
entrypoint, flags, positional arguments, and default values.

### Recommended Validation Pass

1. Pick representative cards, including reordered segments and empty
   `segments`.
2. Open the HTML or run the panel preview builder; confirm each preview is
   non-empty and shell-valid.
3. Apply structural compliance to every default command.
4. Apply semantic equivalence against project docs, not literal string equality.
5. Confirm high-impact editable fields appear early in `segments`.

## Updating Existing Panels

When modifying an existing `cli-panel.html`:

- Preserve user-added command groups, labels, descriptions, and parameter values
  when they still map to the current CLI.
- Update `fixedText` and parameter names to match the latest project command
  format.
- Remove stale parameters only when they no longer exist or are actively
  misleading.
- Add new required parameters with safe placeholder values.
- Keep existing project-specific `localStorage` keys stable unless the user asks
  for a clean reset.
- If the panel still uses template keys, replace them with project-specific
  keys.

## Defaults

The page has two persistent states:

- Current state: saved automatically under the page's `storageKey`.
- Saved default: set by the page's `Set as default` button under `defaultsKey`.

When preparing a project-specific panel, edit `defaultState` in the HTML so a
fresh browser starts with useful commands. Users can later make browser-local
edits and set a new default from the UI.
