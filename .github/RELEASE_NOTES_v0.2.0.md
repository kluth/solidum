# Solidum v0.2.0 Release Notes

## 🎉 What's New

### 🐛 @sldm/debug - Comprehensive Debugging Package

We're excited to introduce `@sldm/debug`, a powerful debugging and monitoring package that brings professional-grade debugging tools to your Solidum applications!

**Key Features:**

- **📊 Structured Logging** - Multiple log levels (TRACE, DEBUG, INFO, WARN, ERROR, FATAL) with namespace organization
- **🎨 Multiple Formatters** - Export logs as JSON, HTML, Markdown, or plain text
- **📡 Real-time Streaming** - SSE and WebSocket support for live log monitoring
- **⚡ Performance Monitoring** - FPS tracking, memory monitoring, and custom performance measurements
- **🔍 Reactive Debugging** - Track signal changes, effects, and state history
- **⏰ Time Travel** - Snapshot and replay state changes for debugging
- **🌳 Component Tree Visualization** - ASCII and Mermaid diagram exports
- **🚀 Debug API Server** - HTTP endpoints for external debugging tools

```typescript
import { logger, PerformanceMonitor, ReactiveDebugger } from '@sldm/debug';

// Structured logging with namespaces
const apiLogger = logger.namespace('api');
apiLogger.info('Request received', { method: 'GET', path: '/users' });

// Performance monitoring
const perfMonitor = new PerformanceMonitor();
perfMonitor.mark('start');
await fetchData();
perfMonitor.measure('fetch-duration', 'start');

// Reactive state tracking
const reactiveDebugger = new ReactiveDebugger();
reactiveDebugger.trackUpdate('counter', 0, 1);
```

### 🛠️ Enhanced CLI Tools

The Solidum CLI has been completely overhauled with comprehensive workflow commands:

**New Commands:**

- `solidum build` - Build with **parallel execution** for monorepos
- `solidum test` - Run tests with coverage, UI, and CI modes
- `solidum dev` - Start development server with HMR
- `solidum typecheck` - TypeScript type checking
- `solidum lint` - ESLint with auto-fix
- `solidum format` - Prettier code formatting
- `solidum clean` - Clean build artifacts and dependencies
- `solidum publish` - Full publish workflow with safety checks

**Workflow Improvements:**

- **Parallel Builds** - Layer-based dependency resolution for optimal build performance
- **Watch Modes** - All commands support watch mode for continuous development
- **Package-Specific Operations** - Target specific packages in monorepos
- **Safety Checks** - Git status checks, test validation before publish

```bash
# Parallel build across all packages
solidum build --parallel

# Watch tests for a specific package
solidum test --package @sldm/core --watch

# Full publish workflow with dry-run
solidum publish --dry-run
```

### 📦 Enhanced Project Templates

Generated projects now include production-ready configurations:

- **Optimized Vite Config** - Code splitting, sourcemaps, and optimized dependencies
- **Vitest Configuration** - Coverage reporting with v8, jsdom environment
- **ESLint & Prettier** - Consistent code quality and formatting
- **Complete npm Scripts** - dev, build, test, lint, format, typecheck, and more
- **Better Dependencies** - Pre-configured with all testing and linting tools

```bash
solidum new my-app --template spa --ui
cd my-app
pnpm install
# Everything ready to go!
```

## 🚀 Improvements

### Build System

- **Parallel Package Builds** - Significantly faster builds in monorepos with intelligent dependency resolution
- **Layer-based Build Order** - Packages built in optimal order based on dependencies
- **Watch Mode Support** - Continuous rebuilds during development

### Developer Experience

- **Improved Error Messages** - Clearer, more actionable error messages across all CLI commands
- **Better TypeScript Support** - Enhanced type definitions and stricter type checking
- **Streamlined Workflow** - Fewer commands needed for common tasks

## 🐛 Bug Fixes

- Removed duplicate `packages/packages` directory (cleanup)
- Fixed package dependency order in parallel builds
- Updated outdated documentation across all packages
- Cleaned up temporary files and build artifacts

## 📚 Documentation Updates

- Added comprehensive README for @sldm/debug
- Updated CLI documentation with all new commands
- Added usage examples and tutorials
- Updated main README with debugging examples
- Enhanced CHANGELOG with detailed release notes

## 🔄 Migration Guide

### For Existing Projects

No breaking changes! This release is fully backward compatible.

To add the new debug package to an existing project:

```bash
# Add debug utilities
solidum add debug
pnpm install

# Or manually
pnpm add @sldm/debug
```

### CLI Updates

If you're using the Solidum CLI, rebuild to get the new commands:

```bash
cd cli
go build -o solidum.exe
./solidum.exe --help
```

## 📦 Package Versions

All packages updated to `v0.2.0`:

- @sldm/core - Core reactive primitives
- @sldm/ui - UI component library
- @sldm/router - SPA routing
- @sldm/store - State management
- @sldm/context - Dependency injection
- @sldm/ssr - Server-side rendering
- @sldm/utils - Utility functions
- @sldm/testing - Testing framework
- **@sldm/debug - NEW! Debugging utilities**
- @sldm/storage - Storage abstraction
- @sldm/integrations - Third-party integrations
- @sldm/dev-reports - Development reports
- @sldm/ui-chalk - Terminal UI

## 🙏 Thank You

Thank you to everyone who provided feedback and helped shape this release!

## 🔮 What's Next

In upcoming releases, we're planning:

- Browser DevTools extension for @sldm/debug
- More UI components and themes
- Enhanced SSR capabilities
- Performance optimizations
- More CLI templates and generators
- Integration with popular backends

---

**Full Changelog:** https://github.com/kluth/solidum/blob/main/CHANGELOG.md
**Documentation:** https://kluth.github.io/solidum/
