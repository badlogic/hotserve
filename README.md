# @mariozechner/hotserve

Minimal hot-reload development server. Zero config, zero bullshit.

## Usage

```bash
npx @mariozechner/hotserve [options]
```

## Options

- `-p, --port <port>` - Port to run server on (default: 4000)
- `--path <mapping>` - Path mapping in format `local-dir:route` (can be specified multiple times)
- `-v, --verbose` - Verbose output
- `-h, --help` - Display help

## Examples

Serve current directory on port 4000:

```bash
npx @mariozechner/hotserve
```

Serve on custom port:

```bash
npx @mariozechner/hotserve --port 3000
```

Map multiple directories:

```bash
npx @mariozechner/hotserve --path dist:/static --path public:/ --port 8080
```

Serve example folder at root and dist at /static:

```bash
npx @mariozechner/hotserve --path example:/ --path dist:/static
```

## Features

- Auto-reload on file changes
- Injects reload script into HTML files automatically
- Disables caching for development
- Multiple path mappings
- Zero configuration needed

## Development

```bash
# Clone and install
git clone https://github.com/badlogic/hotserve
cd hotserve
npm install

# Run locally
npx tsx src/cli.ts --path example:/ --port 4000

# Build
npm run build
```

## Publishing

The `publish.sh` script handles versioning, tagging, and publishing:

```bash
# Patch release (1.0.0 -> 1.0.1)
./publish.sh

# Minor release (1.0.1 -> 1.1.0)
./publish.sh minor

# Major release (1.1.0 -> 2.0.0)
./publish.sh major
```

The script will:

1. Check for uncommitted changes
2. Run checks (format, lint, type-check)
3. Build the project
4. Bump version in package.json
5. Commit and tag the version
6. Push to GitHub with tags
7. Publish to npm

Manual publishing:

```bash
npm version patch  # or minor/major
git push && git push --tags
npm run build
npm publish --access public
```

## License

MIT
