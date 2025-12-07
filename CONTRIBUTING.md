# Contributing to Super Next.js 16 Boilerplate

First off, thank you for considering contributing to this project! 🎉

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, pnpm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear use case** - why is this enhancement needed?
- **Proposed solution** - how should it work?
- **Alternatives considered** - what other approaches did you think about?

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** outlined below
3. **Write tests** for new features
4. **Update documentation** if you're changing functionality
5. **Ensure all tests pass** before submitting
6. **Write a clear PR description** explaining what and why

## 💻 Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/best-nextjs-16-react-19-boilerplate.git

# 2. Install dependencies (pnpm is required)
pnpm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start development server
pnpm dev
```

## 📋 Coding Standards

### TypeScript

- **No `any` types** - Use proper typing or `unknown`
- **Explicit return types** for functions
- **Strict mode enabled** - Follow all TypeScript strict checks

### React

- **Server Components first** - Only use `"use client"` when necessary
- **Named function components** - No arrow functions for components
- **Proper error boundaries** - Handle errors gracefully

### Code Style

- **ESLint** - All code must pass linting (`pnpm lint`)
- **Prettier** - Code is auto-formatted on commit
- **Import sorting** - Use absolute imports with `@/` prefix

### File Structure

Follow the Feature-Sliced Design architecture:

```
src/
├── features/          # Feature-specific code
│   └── feature-name/
│       ├── actions/   # Server actions
│       ├── components/# Feature UI
│       ├── schemas/   # Zod schemas
│       └── types/     # TypeScript types
├── components/        # Shared components
└── api/              # Network layer
```

## 🧪 Testing

All new features should include tests:

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm e2e

# Run tests in watch mode
pnpm test:watch
```

### Testing Guidelines

- **Unit tests** for utilities and business logic
- **Component tests** for UI components
- **E2E tests** for critical user flows
- **Aim for meaningful coverage**, not just high numbers

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new authentication provider
fix: resolve login redirect issue
docs: update README with new examples
test: add tests for user registration
chore: update dependencies
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🔍 Code Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **At least one maintainer** must approve
3. **All conversations** must be resolved
4. **Squash and merge** is preferred for clean history

## 📚 Documentation

- Update **README.md** for user-facing changes
- Add **JSDoc comments** for complex functions
- Update **type definitions** when changing APIs
- Include **examples** for new features

## 🎯 Priority Areas

We're especially interested in contributions for:

- 🧪 **More test coverage** (especially E2E tests)
- 📖 **Better documentation** and examples
- 🎨 **UI/UX improvements** for components
- ⚡ **Performance optimizations**
- 🔒 **Security enhancements**

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out to [@Faizanahmedsy](https://github.com/Faizanahmedsy).

---

Thank you for contributing! 🙏
