# Publishing Solidum Packages to npm

This guide explains how to publish Solidum packages to npm.

## Prerequisites

1. **npm account**: Create one at [npmjs.com](https://www.npmjs.com)
2. **npm login**: Run `npm login` to authenticate
3. **Publishing rights**: Ensure you have rights to publish to the `@sldm` scope

## Quick Publish

To publish all packages at once:

```bash
pnpm publish:all
```

This command will:

1. Build all packages
2. Run tests
3. Prepare packages (add metadata, update dependencies)
4. Publish to npm

## Individual Package Publish

To publish a single package:

```bash
cd packages/core
npm publish --access public
```

## Manual Steps

### 1. Prepare Packages

```bash
pnpm publish:prepare
```

This updates all package.json files with:

- Author information
- License (MIT)
- Repository URL
- Keywords
- publishConfig

### 2. Build Packages

```bash
pnpm build
```

### 3. Run Tests

```bash
pnpm test
```

### 4. Publish

```bash
pnpm publish:packages
```

## Version Management

Before publishing, update version numbers:

```bash
# Update version in all packages
pnpm -r exec npm version patch  # or minor, major
```

## Package Structure

Each package must have:

- `dist/` folder with compiled code
- `package.json` with proper metadata
- `README.md` with documentation
- TypeScript definitions (`.d.ts` files)

## Publishing Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] TypeScript compiles (`pnpm build`)
- [ ] Version numbers updated
- [ ] Changelogs updated
- [ ] README files up to date
- [ ] Logged into npm (`npm whoami`)
- [ ] Published (`pnpm publish:all`)

## Automated Publishing

For CI/CD publishing, set up GitHub Actions with npm token:

1. Create npm automation token: `npm token create`
2. Add to GitHub secrets as `NPM_TOKEN`
3. Use in workflow:

```yaml
- run: echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc
- run: pnpm publish:all
```

## Troubleshooting

### "You must be logged in"

Run `npm login` first

### "Package already exists"

Version number must be unique, increment version

### "Workspace dependency not found"

Run `pnpm publish:prepare` to convert workspace:\* to version numbers

## Package URLs

After publishing, packages will be available at:

- Core: https://www.npmjs.com/package/@sldm/core
- UI: https://www.npmjs.com/package/@sldm/ui
- Router: https://www.npmjs.com/package/@sldm/router
- Store: https://www.npmjs.com/package/@sldm/store
- Context: https://www.npmjs.com/package/@sldm/context
- SSR: https://www.npmjs.com/package/@sldm/ssr
- Testing: https://www.npmjs.com/package/@sldm/testing
- Utils: https://www.npmjs.com/package/@sldm/utils
