# Contributing to CivicLedger

Thank you for your interest in contributing to CivicLedger! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/CivicLedger.git
   cd CivicLedger
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Code Standards

### Style Guide

- Use ES6+ features
- Follow Airbnb JavaScript style guide (enforced by ESLint)
- Write meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### Before Committing

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test
```

### Commit Messages

Follow conventional commits:

```
feat: add new voting algorithm
fix: resolve merkle proof verification bug
docs: update API documentation
test: add tests for signature verification
refactor: simplify database queries
chore: update dependencies
```

## Testing

- Write tests for all new features
- Maintain >80% code coverage
- Test both happy paths and error cases
- Use descriptive test names

```javascript
describe('Feature Name', () => {
  it('should handle valid input correctly', () => {
    // Test implementation
  });

  it('should reject invalid input', () => {
    // Test implementation
  });
});
```

## Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Add tests
   - Update documentation

3. **Test Thoroughly**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots if applicable

## Code Review

All submissions require review. We use GitHub pull requests for this purpose. Reviewers will check:

- Code quality and style
- Test coverage
- Documentation
- Performance implications
- Security considerations

## Areas for Contribution

### High Priority

- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Add comprehensive audit logging
- [ ] Improve error messages
- [ ] Add input sanitization

### Medium Priority

- [ ] Add vote uniqueness checks
- [ ] Implement persistent key storage
- [ ] Add database migrations
- [ ] Improve IPFS error handling
- [ ] Add metrics/monitoring

### Documentation

- [ ] Add more code examples
- [ ] Create video tutorials
- [ ] Improve API documentation
- [ ] Add architecture diagrams
- [ ] Write security best practices guide

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Documentation improvements
- General questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

