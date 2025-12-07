# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- MIT License for open-source distribution
- Comprehensive package.json metadata (author, repository, bugs, homepage)
- CONTRIBUTING.md with detailed contribution guidelines
- CHANGELOG.md for tracking version history
- CODE_OF_CONDUCT.md for community standards
- SECURITY.md for security policy
- Issue and PR templates for better collaboration

## [0.1.0] - 2025-12-07

### Added

- Initial release of Super Next.js 16 Enterprise Boilerplate
- Next.js 16 with App Router and Turbopack
- React 19 with Server Components and Server Actions
- Tailwind CSS v4 with OKLCH colors
- TypeScript with strict mode enabled
- Vitest for unit and component testing
- Playwright for E2E testing
- ESLint and Prettier with strict rules
- Husky for git hooks and pre-commit checks
- Feature-Sliced Design architecture
- Authentication flow with Server Actions
- Custom useServerAction hook with logging
- 100% Lighthouse score optimization
- Comprehensive README with architecture documentation

### Security

- HttpOnly cookie-based authentication
- Edge middleware for route protection
- Zod schema validation for all inputs
- Strict TypeScript checks

---

## How to Update This Changelog

When making changes, add them under the `[Unreleased]` section in the appropriate category:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

When releasing a new version, move items from `[Unreleased]` to a new version section with the date.
