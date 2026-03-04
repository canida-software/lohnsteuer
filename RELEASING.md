# Releasing

This package uses automated publishing via GitHub Actions with npm OIDC trusted publishing.

## Release Process

1. **Bump version**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Push with tags**
   ```bash
   git push && git push --tags
   ```

3. **Done** - GitHub Actions automatically publishes to npm when a `v*` tag is pushed.

## Version Guidelines

- `patch` (0.0.x): Bug fixes, PAP constant corrections
- `minor` (0.x.0): New tax year support, new features
- `major` (x.0.0): Breaking API changes
