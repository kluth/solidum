# Contributing to Solidum

Thank you for your interest in contributing to Solidum!

## Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/yourusername/solidum.git
cd solidum
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

4. **Run tests**

```bash
npm test
```

## Development Workflow

1. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Write code following the existing style
- Add tests for new functionality
- Update documentation as needed

3. **Run checks**

```bash
npm run lint
npm run typecheck
npm test
```

4. **Commit your changes**

```bash
git add .
git commit -m "feat: add your feature description"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `chore:` - Build/tooling changes

5. **Push and create a pull request**

```bash
git push origin feature/your-feature-name
```

## Code Style

- Use TypeScript strict mode
- Add JSDoc comments for public APIs
- Follow existing naming conventions
- Keep functions small and focused
- Write tests for all new code

## Testing

- Write unit tests for all new functionality
- Aim for >80% code coverage
- Use descriptive test names
- Group related tests in `describe` blocks

Example:

```typescript
describe('MyNewFeature', () => {
  it('should handle basic case', () => {
    // Test implementation
  });

  it('should handle edge case', () => {
    // Test implementation
  });
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new APIs
- Include examples for new features
- Update CHANGELOG.md

## Areas for Contribution

- **New LLM Providers**: Add support for OpenAI, Mistral, etc.
- **Custom Agents**: Create specialized agents for different tasks
- **FSL Extensions**: Enhance the specification language
- **Validators**: Add new quality checks and validators
- **Examples**: Add more example implementations
- **Documentation**: Improve guides and API docs
- **Tests**: Increase test coverage
- **Performance**: Optimize token usage and execution time

## Questions?

Feel free to open an issue for discussion before starting work on a major feature.

Thank you for contributing!
