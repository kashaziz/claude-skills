# Claude Skills Repository

Collection of production-ready Claude skills.

## Skills

### Full-Stack MVP Builder
- **Location:** `skills/full-stack-mvp-builder/`
- **Documentation:** [README](skills/full-stack-mvp-builder/README.md)
- **Version:** 1.0.0
- **Author:** Kashif Aziz

## Packaging

Before installing a skill, you may need to package it into a distributable format. The packaging script creates a ZIP file containing all skill files, which is required for Claude Desktop installation.

Package a skill:
```bash
./scripts/package-skill.sh <skill-name> [version]
```

Example:
```bash
./scripts/package-skill.sh full-stack-mvp-builder 1.0.0
```

The packaged ZIP file will be created in the `dist/` directory with the format `<skill-name>-v<version>.zip`.

**Note:** Packaging is only required for Claude Desktop installation. For Claude Code, you can use the skill directory directly without packaging.

## Installation

Skills can be installed in two ways:

### For Claude Desktop

1. First, package the skill (see [Packaging](#packaging) above):
   ```bash
   ./scripts/package-skill.sh <skill-name>
   ```

2. Install the ZIP file:
   - Open Claude Desktop
   - Go to Settings > Capabilities > Upload skill
   - Select the ZIP file from the `dist/` directory

### For Claude Code

Copy the skill directory directly to your Claude Code skills folder (no packaging required):
```bash
cp -r skills/<skill-name> ~/.claude-code/skills/
```

Or manually copy the skill folder to your Claude Code skills directory.

## License

See [LICENSE](LICENSE) file.

