# Vite Shell Sandbox (Local Only)

This folder is a local Vite app that uses `@one-brd-test/ui` as a consumer app.

## Start from repo root

1. Build package artifacts:

```bash
npm run build:lib
```

2. Pack a local tarball into this sandbox:

```bash
npm pack --pack-destination sandbox/vite-shell/.local-pkgs
```

3. Install sandbox deps and local package:

```bash
cd sandbox/vite-shell
npm install
npm install ./.local-pkgs/one-brd-test-ui-*.tgz
```

## Run sandbox

```bash
npm run dev
```

## Validate sandbox

```bash
npm run typecheck
npm run build
```

## Refresh after package changes

From repo root:

```bash
npm run build:lib
npm pack --pack-destination sandbox/vite-shell/.local-pkgs
```

Then in sandbox:

```bash
npm install ./.local-pkgs/one-brd-test-ui-*.tgz
```
