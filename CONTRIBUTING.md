# Contributing to EduGeneLearn

Thank you for your interest in contributing to EduGeneLearn! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing Requirements](#testing-requirements)
- [Code Quality Standards](#code-quality-standards)
- [License Considerations](#license-considerations)

## Code of Conduct

This project follows a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to Sekacorn@gmail.com.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/EduGeneLearn.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Set up development environment:
   ```bash
   docker-compose up --build
   ```

## Development Workflow

### Backend (Java/Spring Boot)

1. Navigate to the service directory (e.g., `backend/learning-integrator`)
2. Make your changes
3. Run tests: `mvn test`
4. Check code style: `mvn checkstyle:check`
5. Verify coverage: `mvn jacoco:report` (aim for >90%)

### Backend (Python FastAPI)

1. Navigate to the service directory (e.g., `ai-model`)
2. Install dependencies: `pip install -r requirements.txt`
3. Make your changes
4. Run tests: `pytest`
5. Check code style: `flake8 .`

### Frontend (React)

1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Make your changes
4. Run tests: `npm test`
5. Lint code: `npm run lint`
6. Build: `npm run build`

## Testing Requirements

All contributions must include appropriate tests:

- **Unit tests**: Test individual components/functions
- **Integration tests**: Test service interactions
- **End-to-end tests**: Test complete user workflows

### Test Coverage Requirements

- Backend: Minimum 90% line coverage
- Frontend: Minimum 80% line coverage
- All new features must have tests

### Running E2E Tests

```bash
# Frontend E2E tests
cd frontend
npm run test:e2e
```

## Code Quality Standards

### Java/Spring Boot

- Follow Google Java Style Guide
- Use Checkstyle for enforcement
- Document all public methods with Javadoc
- Use meaningful variable/method names
- Handle exceptions appropriately
- Log important events and errors

### Python

- Follow PEP 8 style guide
- Use type hints where appropriate
- Document functions with docstrings
- Use meaningful variable/function names
- Handle exceptions with specific error types

### JavaScript/React

- Use ESLint configuration provided
- Follow Airbnb React Style Guide
- Use functional components with hooks
- PropTypes or TypeScript for type checking
- Meaningful component and variable names

## License Considerations

### Dual License Structure

EduGeneLearn uses a dual license:
- **Non-profit use**: Free and open-source
- **Commercial use**: Requires 6% gross income royalty

### Contributing Code

By contributing, you agree that:
1. Your contributions will be licensed under the same dual license
2. You have the right to submit the code
3. Your code uses only Apache 2.0 or MIT licensed dependencies
4. No proprietary code from PyMOL, Blender, Moodle, or other tools is included

### Dependency Requirements

All dependencies must use:
- Apache License 2.0
- MIT License
- Other permissive open-source licenses

**Do NOT include**:
- GPL licensed code (copyleft conflicts with commercial use)
- Proprietary code
- Code with unclear licensing

## Pull Request Process

1. Update README.md with details of changes (if applicable)
2. Update documentation for new features
3. Add tests for new functionality
4. Ensure all tests pass
5. Ensure code meets quality standards
6. Request review from maintainers

### PR Title Format

```
[Category] Brief description

Categories:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test additions/changes
- chore: Build/tooling changes
```

### PR Description Template

```markdown
## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] All tests passing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Dependencies are properly licensed

## License Compliance
- [ ] No GPL or copyleft licenses introduced
- [ ] All dependencies use Apache 2.0 or MIT
- [ ] No proprietary code included
```

## Questions?

Contact: Sekacorn@gmail.com

Thank you for contributing to EduGeneLearn and helping advance education through genomic insights!
