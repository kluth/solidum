# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-10-04

### Added

#### New Packages

- **@sldm/debug** - Comprehensive debugging and monitoring utilities
  - Structured logging with multiple levels (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
  - Namespace-based log organization
  - Multiple output formatters (JSON, HTML, Markdown, Plain text)
  - Real-time log streaming (SSE, WebSocket)
  - Performance monitoring (FPS, memory, custom measurements)
  - Reactive state debugging with time-travel
  - Component tree visualization (ASCII, Mermaid)
  - Debug API server for external tools
  - Persistent logging support

#### CLI Enhancements

- **Enhanced Solidum CLI** with comprehensive workflow commands
  - `solidum build` - Build with parallel execution support
  - `solidum test` - Run tests with coverage and UI options
  - `solidum dev` - Development server with HMR
  - `solidum typecheck` - TypeScript type checking
  - `solidum lint` - ESLint with auto-fix
  - `solidum format` - Prettier code formatting
  - `solidum clean` - Clean build artifacts and dependencies
  - `solidum publish` - Full publish workflow with safety checks
  - Parallel package builds for monorepo
  - Watch modes for all commands
  - Package-specific operations

#### Project Template Improvements

- Enhanced generated project templates with:
  - Optimized `vite.config.ts` with code splitting and sourcemaps
  - `vitest.config.ts` for comprehensive testing
  - `.eslintrc.json` for code quality
  - `.prettierrc` for consistent formatting
  - Complete npm scripts (dev, build, test, lint, format, typecheck)
  - Better dependency management

#### Documentation

- Added comprehensive README for @sldm/debug package
- Updated CLI documentation with all new commands
- Added usage examples for debug package
- Updated main README with debug package

### Enhanced

#### Build System

- Parallel package builds with dependency resolution
- Layer-based build order for optimal performance
- Support for package-specific builds
- Watch mode for continuous development

#### Developer Experience

- Improved error messages and logging
- Better TypeScript support across all packages
- Enhanced test coverage reporting
- Streamlined development workflow

### Fixed

- Removed duplicate `packages/packages` directory
- Cleaned up temporary and log files
- Updated outdated documentation
- Fixed package dependency order in builds

## [0.1.0] - 2024-10-01

### Added

#### Core Framework

- **@sldm/core** - Fine-grained reactive primitives
  - `atom` - Reactive state containers
  - `computed` - Derived reactive values
  - `effect` - Side-effect execution
  - `batch` - Batched updates for performance
  - `createElement` - Virtual DOM element creation
  - `mount` - Component mounting and rendering

- **@sldm/ui** - Production-ready UI component library
  - Button, Card, Container, Stack components
  - Responsive design system
  - Theme support
  - Accessibility features

- **@sldm/ui-chalk** - Terminal UI components
  - Styled terminal output
  - Progress bars and spinners
  - Tables and layouts

- **@sldm/router** - Simple SPA routing
  - Route definitions
  - Navigation utilities
  - History management

- **@sldm/store** - Global state management
  - Centralized state stores
  - Action dispatching
  - Middleware support

- **@sldm/context** - Dependency injection
  - Context providers
  - Dependency resolution
  - Scoped services

- **@sldm/ssr** - Server-side rendering
  - SSR utilities
  - Hydration support
  - Stream rendering

- **@sldm/utils** - Utility functions
  - Common helpers
  - Type utilities

#### Developer Tools

- **@sldm/testing** - TDD-first testing framework
  - Test utilities for reactive components
  - Mocking and assertions

- **@sldm/storage** - Unified storage abstraction
  - localStorage adapter
  - IndexedDB adapter
  - Database integration

- **@sldm/integrations** - Third-party integrations
  - API clients
  - Service integrations

- **@sldm/dev-reports** - Development reports
  - Progress tracking
  - Build reports
  - Stakeholder communication

#### CLI Tool

- **Solidum CLI** - Project scaffolding and code generation
  - `solidum new` - Create new projects
  - `solidum generate` - Generate components and pages
  - `solidum add` - Add packages to projects
  - Template support (basic, spa, ssr)
  - Component and page generators

#### Development Infrastructure

- TypeScript monorepo setup
- pnpm workspace configuration
- Comprehensive build pipeline
- Testing infrastructure with Vitest
- ESLint and Prettier configuration
- Git hooks with Husky
- CI/CD ready

#### Documentation

- Main README with quick start
- Individual package READMEs
- API documentation
- Examples and tutorials
- Contributing guidelines

### Notes

This release establishes Solidum as a complete framework ecosystem for building modern web applications with fine-grained reactivity, comprehensive tooling, and excellent developer experience.

[0.2.0]: https://github.com/kluth/solidum/releases/tag/v0.2.0
[0.1.0]: https://github.com/kluth/solidum/releases/tag/v0.1.0
