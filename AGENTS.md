---
title: AI Agent Instructions
---

# Package architecture

Two language ecosystems, plus `.meta` self-hosting:

**JS/TS monorepo** (`pnpm-workspace.yaml` — `packages/*.js`):
- `helpers.js` — base library (no deps).
- `cli.js` — CLI framework, depends on `helpers.js`.
- `ppml.js` — pretty print, depends on `helpers.js`.
- `sexp.js` — S-expression parser, depends on `helpers.js` + `ppml.js`.
- `meta-lisp.js` — **bootstrap compiler**, depends on all above + `zod`. Provides the `meta-lisp.js` binary used by `.meta` packages.

**C packages** (each uses shared `c.make/c.mk`):
- `helpers.c` — base library.
- `cli.c` — CLI library, depends on `helpers.c`.
- `xvm.c` — VM, depends on `helpers.c` + `cli.c`.

**`.meta` packages** — Meta-lisp source. Build/run via the `meta-lisp.js` binary from `meta-lisp.js`:
- `meta-builtin.meta` — builtin function declarations.
- `meta-example.meta` — test/demo package.
- `meta-error.meta` — error module tests (type errors are expected output).
- `meta-lisp.meta` — **self-hosting compiler (WIP)**. Has its own `AGENTS.md` with additional workflow (check → test → self-check).

# Build order (dependency chain)

1. `pnpm install` (or `scripts/prepare.sh`)
2. C builds: `helpers.c` → `cli.c` → `xvm.c`
3. JS builds: `helpers.js` → `cli.js`/`ppml.js` → `sexp.js` → `meta-lisp.js`
4. `.meta` tests depend on `meta-lisp.js` binary being built

The top-level `scripts/build.sh` runs C then JS in correct order via `make --directory` and `pnpm run -r build`.

# Developer commands

All from repo root:
```bash
./scripts/prepare.sh  # install deps (pnpm install)
./scripts/clean.sh    # clean all
./scripts/format.sh   # format all (prettier)
./scripts/build.sh    # build all C + JS
./scripts/test.sh     # test all C + JS + .meta
./scripts/all.sh      # prepare → clean → format → build → test
```

Build single C package:
```bash
make --directory packages/<package> build -j
```

Test single C package:
```bash
make --directory packages/<package> test -j
```

Build/test single JS package:
```bash
cd packages/<package> && pnpm build && pnpm test
```

# C conventions (critical — not Makefile, not cmake in dev workflow)

- Every C package has a **lowercase `makefile`** (not `Makefile`), including `c.make/c.mk`.
- The shared `c.make/c.mk` requires **GNU parallel** to run tests in parallel.
- Three test file suffixes (convention, all under `src/`):
  - `*.test.c` — compiled and run as tests.
  - `*.snapshot.c` — compiled and run, stdout captured to `*.out`.
  - `*.exe.c` — compiled to executable but NOT run.
- Tests are found via `find src -name '*.test.c'` — name matters.
- Build output (`.o`, `.test`, `.snapshot`, `.xexe`, etc.) is gitignored.
- CMake is for Windows/IDE use only; dev workflow uses `make`.

# JS/TS conventions

- Tests: **Node's built-in test runner** (`node --test`), not jest/mocha/vitest.
- Test files: `src/**/*.test.ts` (pattern in package.json scripts).
- Formatting: **Prettier** with `prettier-plugin-organize-imports`, `"semi": false`, `"trailingComma": "all"`.
- Build: `tsc` (TypeScript compiled to `dist/`).
- All JS packages are `"type": "module"` (ESM).

# `.meta` package workflow

Every `.meta` package has `scripts/` with `check.sh`, `test.sh`, etc. The standard test flow:
```
check (type-check) → build → test
```

`meta-lisp.meta` adds `self-check.sh` — uses the self-compiled binary to re-check itself. See `meta-lisp.meta/AGENTS.md` for its specific workflow.

# References

- [Syntax reference](docs/en/reference/syntax.md) ([中文](docs/zh/reference/syntax.md))
- [Builtin functions](docs/en/reference/builtin/index.md) ([中文](docs/zh/reference/builtin/index.md))
- [FAQ](docs/en/faq/faq.md) ([中文](docs/zh/faq/faq.md))
- [Windows build](BUILD_WINDOWS.md)
