# CLAUDE.md

## Project Overview

This is the official Claude Code repository — Anthropic's agentic coding CLI tool. It contains the plugin ecosystem, example hooks, automation scripts, GitHub Actions workflows, and a dev container configuration. The core Claude Code binary is distributed via npm (`@anthropic-ai/claude-code`) and platform installers; this repo is not the binary source.

## Repository Structure

```
.claude/commands/       # Custom slash command definitions for this repo
.claude-plugin/         # Plugin marketplace configuration
.devcontainer/          # Docker-based dev container (Node 20, zsh, gh, fzf, etc.)
.github/workflows/      # CI/CD: issue triage, deduplication, stale management, Claude actions
examples/hooks/         # Example hook implementations
plugins/                # 13 official plugins (see plugins/README.md)
scripts/                # Automation scripts (TypeScript/Bun, Bash)
```

### Key Plugins

- **code-review** — Automated PR review with 5 parallel agents and confidence scoring
- **commit-commands** — `/commit`, `/commit-push-pr`, `/clean_gone` git workflows
- **feature-dev** — 7-phase structured feature development
- **hookify** — Create hooks from conversation patterns
- **plugin-dev** — Toolkit for building new plugins
- **pr-review-toolkit** — Specialized review agents (comments, tests, errors, types, simplify)
- **security-guidance** — PreToolUse hook monitoring 9 security patterns

## Tech Stack

- **Runtime**: Node.js 20+
- **Scripts**: TypeScript (Bun runtime), Bash, Python
- **Configuration**: Markdown with YAML frontmatter (agents, commands, skills)
- **Hooks**: Python and Bash executables triggered by events
- **CI**: GitHub Actions on `ubuntu-latest` using `anthropics/claude-code-action@v1`
- **Formatting**: Prettier (format on save)
- **Linting**: ESLint

## Plugin Structure

Every plugin follows this layout:

```
plugin-name/
├── .claude-plugin/plugin.json   # Metadata (name, version, description)
├── commands/                    # Slash commands (markdown with allowed-tools frontmatter)
├── agents/                      # Agent definitions (markdown)
├── skills/                      # Reusable skill definitions
├── hooks/                       # hooks.json + handler scripts
└── README.md
```

## Hook System

Hooks are event-driven handlers defined in `hooks.json`. Supported events:
- **PreToolUse** / **PostToolUse** — Before/after tool execution
- **SessionStart** — Session initialization
- **UserPromptSubmit** — When user submits a prompt
- **Stop** — When agent attempts to stop

Hook scripts use `${CLAUDE_PLUGIN_ROOT}` for relative paths and receive context via stdin JSON.

## Development

### Dev Container

The `.devcontainer/` provides a Docker environment with all tools pre-installed:
- Node 20, npm, gh CLI, git, jq, fzf, zsh, delta (diff viewer)
- Firewall initialization via `init-firewall.sh`
- Non-root user (`node`) with sudo for firewall only

### Scripts

Scripts in `scripts/` use Bun as runtime (shebang: `#!/usr/bin/env bun`) and TypeScript. They handle GitHub automation (duplicate detection, issue commenting).

### Validation

Plugin development includes validation scripts in `plugins/plugin-dev/skills/`:
- `validate-hook-schema.sh` — Validate hooks.json structure
- `validate-agent.sh` — Validate agent markdown definitions
- `test-hook.sh` — Test hook execution

## Conventions

- **Markdown-first config**: Agents, commands, and skills are defined as markdown files, not JSON/YAML
- **Allowed-tools frontmatter**: Commands and agents declare permitted tools in YAML frontmatter
- **Confidence-based filtering**: Code review agents use confidence scores to reduce false positives
- **Parallel agent execution**: Multiple agents run concurrently where possible
- **Environment variables**: `CLAUDE_PLUGIN_ROOT`, `CLAUDE_CONFIG_DIR`, `DEVCONTAINER`
- **Only `.DS_Store` in .gitignore**: Keep the repo minimal

## CI/CD Workflows

| Workflow | Purpose |
|----------|---------|
| `claude.yml` | Run Claude on issue comments, PR reviews, issues |
| `claude-issue-triage.yml` | Auto-triage new issues |
| `claude-dedupe-issues.yml` | Detect and close duplicate issues |
| `stale-issue-manager.yml` | Mark and close stale issues |
| `lock-closed-issues.yml` | Lock old closed issues |
| `oncall-triage.yml` | Scheduled on-call triage |

## Contributing

1. Follow the standard plugin structure when adding plugins
2. Include a comprehensive README.md in each plugin
3. Add plugin metadata in `.claude-plugin/plugin.json`
4. Document all commands and agents with usage examples
5. Use existing validation scripts to verify plugin correctness
