# Releasing

This package uses GitHub Actions with npm OIDC trusted publishing.

Current repository state: the publish workflow is manual-only (`workflow_dispatch`).

## Release Process

1. **Bump version**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Push changes**
   ```bash
   git push
   ```

3. **Run Publish workflow manually**
   - GitHub -> Actions -> `Publish` -> `Run workflow`

If you want tag-based auto publish again, restore the trigger in `.github/workflows/publish.yml`:

```yaml
on:
  push:
    tags:
      - "v*"
```

## Version Guidelines

- `patch` (0.0.x): Bug fixes, PAP constant corrections
- `minor` (0.x.0): New tax year support, new features
- `major` (x.0.0): Breaking API changes
