# Contributing to tasknest

Thank you for your interest in contributing to **tasknest**! We welcome contributions from the community to help make this task management application even better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)
- [Testing](#testing)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

Before you begin contributing, please:

1. Fork the repository
2. Set up your development environment (see [Development Setup](#development-setup))
3. Read through this contributing guide
4. Look at existing issues and pull requests to understand ongoing work

## Development Setup

### Prerequisites

- Node.js (v22.15.0 recommended - see `.nvmrc`)
- MongoDB (v4 or higher)
- Git
- NVM (Node Version Manager) - recommended for managing Node.js versions

### Installing NVM (if not already installed)

**macOS/Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart your terminal or run:
source ~/.bashrc
```

**Windows:**
Download and install from [nvm-windows](https://github.com/coreybutler/nvm-windows)

### Setup Steps

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/tasknest.git
   cd tasknest
   ```

2. **Set up Node.js version (recommended using NVM):**

   ```bash
   # Install and use the recommended Node.js version
   nvm install
   nvm use

   # Verify the Node.js version
   node --version  # Should show v22.15.0
   ```

   **Alternative without NVM:**
   If you don't have NVM installed, make sure you're using Node.js v22.15.0 or compatible version.

3. **Add the original repository as upstream:**

   ```bash
   git remote add upstream https://github.com/Md-Dipu/tasknest.git
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start MongoDB:**

   ```bash
   mongod
   ```

7. **Run the application:**
   ```bash
   npm start
   ```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**
- **New features**
- **Documentation improvements**
- **Code refactoring**
- **UI/UX enhancements**
- **Performance optimizations**
- **Test coverage improvements**

### Workflow

1. **Create an issue** (if one doesn't exist) describing the bug or feature
2. **Fork the repository** and create a new branch
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Submit a pull request** with a clear description

## Coding Standards

### JavaScript/Node.js

- Use **ES6+** features where appropriate
- Follow **camelCase** naming convention
- Use **const** and **let** instead of **var**
- Add JSDoc comments for functions and classes
- Keep functions small and focused
- Use meaningful variable and function names

### Frontend (EJS/CSS/JavaScript)

- Use semantic HTML elements
- Follow **BEM** methodology for CSS classes
- Ensure responsive design
- Add ARIA attributes for accessibility
- Use consistent indentation (2 spaces)

### Example Code Style

```javascript
/**
 * Creates a new task in the specified list
 * @param {string} listId - The ID of the list
 * @param {Object} taskData - The task data
 * @returns {Promise<Object>} The created task
 */
const createTask = async (listId, taskData) => {
  try {
    const task = new Task({
      ...taskData,
      listId,
      createdAt: new Date(),
    });

    return await task.save();
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
};
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
feat(dashboard): add task filtering by priority
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(css): improve button hover animations
```

## Pull Request Process

### Before Submitting

1. **Sync with upstream:**

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Test your changes:**
   ```bash
   npm test
   npm run lint
   ```

### Pull Request Checklist

- [ ] Code follows our coding standards
- [ ] Tests pass locally
- [ ] Changes are documented (if applicable)
- [ ] Commit messages follow our guidelines
- [ ] No merge conflicts with main branch
- [ ] Screenshots included for UI changes
- [ ] Breaking changes are documented

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing

- [ ] I have tested these changes locally
- [ ] I have added/updated tests as needed

## Screenshots (if applicable)

Add screenshots for UI changes.

## Additional Notes

Any additional information or context.
```

## Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior**
- **Actual behavior**
- **Environment details** (OS, Browser, Node.js version)
- **Screenshots** (if applicable)
- **Error messages** or console logs

### Bug Report Template

```markdown
**Bug Description:**
A clear description of what the bug is.

**To Reproduce:**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What you expected to happen.

**Screenshots:**
If applicable, add screenshots.

**Environment:**

- OS: [e.g., Windows 10, macOS 11]
- Browser: [e.g., Chrome 91, Firefox 89]
- Node.js version: [e.g., 16.14.0]
```

## Feature Requests

When requesting features:

- **Use case**: Explain why this feature would be useful
- **Description**: Detailed description of the proposed feature
- **Mockups**: Visual mockups or wireframes (if applicable)
- **Implementation ideas**: Suggestions for how it could be implemented

## Documentation

Documentation improvements are always welcome:

- Fix typos or grammatical errors
- Improve clarity and readability
- Add missing documentation
- Update outdated information
- Translate documentation to other languages

### Documentation Standards

- Use clear, concise language
- Include code examples where appropriate
- Keep README.md up to date
- Add JSDoc comments to code
- Update API documentation for changes

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix
```

### Writing Tests

- Write tests for new features
- Update tests for modified functionality
- Aim for good test coverage
- Use descriptive test names
- Include both positive and negative test cases

### Test Structure

```javascript
describe('Task Controller', () => {
  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      // Test implementation
    });

    it('should return error for invalid data', async () => {
      // Test implementation
    });
  });
});
```

## Questions?

If you have questions about contributing, please:

1. Check existing issues and documentation
2. Open a new issue with the "question" label
3. Reach out via email: **srdipu@hotmail.com**

## Recognition

Contributors will be recognized in our README.md file. Thank you for helping make tasknest better!

---

**Happy Contributing! 🚀**
