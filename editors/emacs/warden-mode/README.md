# warden-mode

Emacs major mode for watching a directory and automatically re-running a shell command on file changes.

## Features

- Watches a directory recursively for file changes (create, modify, delete, rename)
- Re-runs a user-specified shell command on each change
- YAML-style front matter with colored status (ok/error) in output buffer
- Highlights `file:line:col` location patterns as clickable links
- Error folding (`TAB` / `<backtab>`) for clean overview
- Location navigation (`RET` to jump, `M-n` / `M-p` to cycle)
- Debounced execution (0.3s by default, configurable via `warden-debounce-interval`)
- Support for multiple concurrent watch buffers

## Installation

### Manual

Clone or copy the `warden-mode` directory into your Emacs load path, then add to `init.el`:

```elisp
(add-to-list 'load-path "~/.emacs.d/warden-mode")
(require 'warden-mode)
```

### use-package

```elisp
(use-package warden-mode
  :load-path "~/.emacs.d/warden-mode"
  :bind ("C-c w" . warden))
```

### straight.el

```elisp
(use-package warden-mode
  :straight (warden-mode
             :type git
             :host github
             :repo "xieyuheng/meta-lisp"
             :files ("editors/emacs/warden-mode/*.el"))
  :bind ("C-c w" . warden))
```

## Usage

```
M-x warden
```

Prompts:

| Prompt | Default | Description |
|--------|---------|-------------|
| Watch directory | `src` | Directory to watch recursively |
| Command | `./scripts/check.sh` | Shell command to run on changes |

Output appears in a read-only buffer named `*warden: <dir>*`.

### Key bindings in warden buffer

| Key | Command |
|-----|---------|
| `<f5>` | `warden-rerun` — manually re-run the command |
| `RET` | `warden-jump-to-location` — open file at `file:line:col` in other window |
| `TAB` | `warden-toggle-block` — fold/unfold current error block |
| `<backtab>` | `warden-toggle-all-blocks` — fold/unfold all error blocks |
| `M-n` | `warden-next-location` — move to next location |
| `M-p` | `warden-prev-location` — move to previous location |

The buffer's `kill-buffer-hook` automatically cleans up file watches and kills any running process.

### Example

From a `.meta` project directory:

```
M-x warden
Watch directory: src
Command: ./scripts/check.sh
```

Every time a file in `src/` changes, `check.sh` re-runs and the output updates in `*warden: .../src/*`.

## Customization

- `warden-debounce-interval` (default `0.3`) — seconds to wait after last file change before re-running
