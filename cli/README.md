# Solidum CLI

> Code generator and project scaffolding tool for Solidum framework

> **Note**: Generated projects use the `@sldm` npm organization for dependencies.

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

### Project Scaffolding

#### `solidum new [name]`

Create a new Solidum project.

**Options:**

- `-t, --template <type>` - Project template (basic, spa, ssr)
- `--router` - Include @sldm/router
- `--ui` - Include @sldm/ui
- `--ssr` - Include @sldm/ssr

#### `solidum generate|g`

Generate code scaffolding.

**Subcommands:**

- `component|c [name]` - Generate a component
- `page|p [name]` - Generate a page

**Options:**

- `-p, --path <path>` - Output directory
- `--functional` - Generate functional component (default: true)

#### `solidum add [package]`

Add a Solidum package to your project.

**Available packages:**

- `router` - @sldm/router (SPA routing)
- `ui` - @sldm/ui (UI components)
- `store` - @sldm/store (State management)
- `context` - @sldm/context (Dependency injection)
- `ssr` - @sldm/ssr (Server-side rendering)
- `testing` - @sldm/testing (Test utilities)
- `debug` - @sldm/debug (Debugging utilities)

### Development Workflow

#### `solidum dev`

Start development server with hot module reloading.

**Options:**

- `-p, --port <number>` - Port to run dev server on
- `-f, --package <name>` - Run dev server for specific package (monorepo)
- `-a, --all` - Run dev servers for all packages in parallel (monorepo)

#### `solidum build`

Build the project with optimizations.

**Options:**

- `-w, --watch` - Watch mode - rebuild on changes
- `-p, --parallel` - Build packages in parallel (default: true, monorepo)
- `-f, --package <name>` - Build specific package (monorepo)

#### `solidum test`

Run tests with Vitest.

**Options:**

- `-w, --watch` - Watch mode - rerun tests on changes
- `-c, --coverage` - Generate coverage report
- `-u, --ui` - Open Vitest UI
- `-f, --package <name>` - Test specific package (monorepo)
- `--ci` - Run in CI mode with verbose output
- `-p, --parallel` - Run tests in parallel (monorepo)

### Code Quality

#### `solidum typecheck`

Run TypeScript type checking.

**Options:**

- `-w, --watch` - Watch mode - recheck on changes
- `-f, --package <name>` - Typecheck specific package (monorepo)

#### `solidum lint`

Run ESLint on the project.

**Options:**

- `-f, --fix` - Automatically fix problems
- `-p, --package <name>` - Lint specific package (monorepo)

#### `solidum format`

Format code with Prettier.

**Options:**

- `-c, --check` - Check formatting without modifying files

### Maintenance

#### `solidum clean`

Clean build artifacts and dependencies.

**Options:**

- `-a, --all` - Clean everything (dist, node_modules, cache)
- `-d, --dist` - Clean dist folders only
- `-m, --modules` - Clean node_modules
- `-c, --cache` - Clean package manager cache

#### `solidum publish`

Build, test, and publish packages to npm.

**Options:**

- `--dry-run` - Simulate publish without actually publishing
- `-t, --tag <name>` - npm dist-tag (latest, next, beta, etc.)
- `--access <type>` - Package access (public or restricted)
- `-f, --force` - Skip confirmation prompts

## Examples

### Create and run a new app

```bash
# Create a new app with SPA template and UI
solidum new my-awesome-app --template spa --ui
cd my-awesome-app

# Install dependencies
pnpm install

# Start development server
solidum dev
```

### Development workflow

```bash
# Run dev server
solidum dev

# Build for production
solidum build

# Build with parallel execution (monorepo)
solidum build --parallel

# Run tests
solidum test

# Run tests in watch mode
solidum test --watch

# Run tests with coverage
solidum test --coverage

# Type checking
solidum typecheck

# Lint and fix issues
solidum lint --fix

# Format code
solidum format
```

### Generate components

```bash
solidum g c Header
solidum g c Button --path src/components/ui
solidum g p Dashboard
```

### Monorepo operations

```bash
# Build specific package
solidum build --package @sldm/core

# Test specific package
solidum test --package @sldm/router

# Run dev for all packages
solidum dev --all

# Clean everything
solidum clean --all
```

### Publishing

```bash
# Dry run to test publish
solidum publish --dry-run

# Publish to npm
solidum publish

# Publish with beta tag
solidum publish --tag beta
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
