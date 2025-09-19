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

- 🔥 Auto-reload on file changes
- 💉 Injects reload script into HTML files automatically
- 🚫 Disables caching for development
- 🗂️ Multiple path mappings
- 📦 Zero configuration needed

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

# Test
npm test
```

## Publishing

```bash
npm run build
npm publish
```

## License

MIT