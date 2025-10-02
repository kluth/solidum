# Solidum CLI

> Code generator and project scaffolding tool for Solidum framework

## Installation

### From Source

```bash
cd cli
go build -o solidum
```

### Or install globally

```bash
go install github.com/kluth/solidum-cli@latest
```

## Usage

### Create a new project

```bash
# Basic project
solidum new my-app

# SPA with router
solidum new my-app --template spa

# With UI components
solidum new my-app --ui

# Full-featured app
solidum new my-app --template spa --ui
```

### Generate components

```bash
# Generate a component
solidum generate component Button
solidum g c Button  # short form

# Generate in specific directory
solidum g c Button --path src/components/ui

# Generate a page
solidum generate page Home
solidum g p Home
```

### Add packages

```bash
# Add router
solidum add router

# Add UI library
solidum add ui

# Add state management
solidum add store
```

## Commands

### `solidum new [name]`

Create a new Solidum project.

**Options:**
- `-t, --template <type>` - Project template (basic, spa, ssr)
- `--router` - Include @solidum/router
- `--ui` - Include @solidum/ui
- `--ssr` - Include @solidum/ssr

### `solidum generate|g`

Generate code scaffolding.

**Subcommands:**
- `component|c [name]` - Generate a component
- `page|p [name]` - Generate a page

**Options:**
- `-p, --path <path>` - Output directory
- `--functional` - Generate functional component (default: true)

### `solidum add [package]`

Add a Solidum package to your project.

**Available packages:**
- `router` - @solidum/router (SPA routing)
- `ui` - @solidum/ui (UI components)
- `store` - @solidum/store (State management)
- `context` - @solidum/context (Dependency injection)
- `ssr` - @solidum/ssr (Server-side rendering)
- `testing` - @solidum/testing (Test utilities)

## Examples

### Create and run a new app

```bash
solidum new my-awesome-app --template spa --ui
cd my-awesome-app
pnpm install
pnpm dev
```

### Generate components

```bash
solidum g c Header
solidum g c Button --path src/components/ui
solidum g p Dashboard
```

### Add packages later

```bash
solidum add router
solidum add store
pnpm install
```

## Project Structure

A new Solidum project has the following structure:

```
my-app/
├── src/
│   ├── components/
│   │   └── App.ts
│   ├── pages/           # if using SPA template
│   └── main.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Build

```bash
go build -o solidum
```

### Run

```bash
./solidum --help
```

### Add to PATH

**macOS/Linux:**
```bash
cp solidum /usr/local/bin/
```

**Windows:**
```powershell
# Add the CLI directory to your PATH
$env:Path += ";C:\path\to\cli"
```

## License

MIT © Matthias Kluth
