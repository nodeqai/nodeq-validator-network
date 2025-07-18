# Contributing to NodeQ Validator Network

Thank you for your interest in contributing to NodeQ Validator Network! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear and descriptive title**
- **Steps to reproduce** the problem
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, browser, Node.js version)
- **Screenshots** if applicable
- **Console errors** if any

### Suggesting Enhancements

We welcome feature requests! When suggesting enhancements:

- **Describe the feature** in detail
- **Explain the use case** and benefits
- **Consider implementation** complexity
- **Check existing issues** for similar requests

### Code Contributions

#### Development Setup

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes
6. **Test** your changes: `npm run test`
7. **Commit** with clear messages: `git commit -m 'Add amazing feature'`
8. **Push** to your fork: `git push origin feature/amazing-feature`
9. **Create** a Pull Request

#### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Use functional components with hooks
- **Naming**: Use descriptive names, follow camelCase
- **Comments**: Add comments for complex logic
- **Formatting**: Use Prettier (run `npm run format`)

#### Testing

- Write unit tests for new features
- Ensure all tests pass: `npm run test`
- Maintain good test coverage: `npm run test:coverage`

#### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(validator): add Solana validator support
fix(ui): resolve deployment modal closing issue
docs(readme): update installation instructions
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DeployValidatorModal.tsx
│   ├── DeploymentProgressModal.tsx
│   └── DeploymentSuccessModal.tsx
├── pages/              # Page components
│   ├── Validator.tsx   # Main validator page
│   └── Dashboard.tsx   # Dashboard overview
├── contexts/           # React contexts
│   └── NodeContext.tsx # Node state management
├── assets/             # Static assets
│   └── ChainsSymbols/  # Blockchain logos
└── wallet/             # Web3 integration
    └── web3modal.ts
```

## 🔧 Development Workflow

### Adding New Validator Networks

1. **Add chain logo** to `src/assets/ChainsSymbols/`
2. **Update** `VALIDATOR_CHAINS` array in `src/pages/Validator.tsx`
3. **Configure** staking requirements and APY ranges
4. **Test** deployment flow
5. **Update** documentation

### Adding New Features

1. **Plan** the feature implementation
2. **Create** necessary components
3. **Update** state management if needed
4. **Add** tests for new functionality
5. **Update** documentation
6. **Test** thoroughly

### Bug Fixes

1. **Reproduce** the issue
2. **Identify** the root cause
3. **Fix** the problem
4. **Add** tests to prevent regression
5. **Test** the fix thoroughly

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] **Tests pass**: `npm run test`
- [ ] **Linting passes**: `npm run lint`
- [ ] **Type checking passes**: `npm run type-check`
- [ ] **Code is formatted**: `npm run format`
- [ ] **Documentation updated** if needed
- [ ] **Screenshots added** for UI changes

### PR Description

Include:
- **Summary** of changes
- **Motivation** for changes
- **Testing** performed
- **Screenshots** for UI changes
- **Breaking changes** if any

## 🐛 Issue Templates

### Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node.js: [e.g. 18.17.0]

## Additional Information
Any other context, screenshots, or logs
```

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you considered

## Additional Information
Any other context or examples
```

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub** contributors page

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create issues for bugs or feature requests
- **Discord**: Join our community server
- **Email**: Contact us directly

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to NodeQ Validator Network! 🚀 