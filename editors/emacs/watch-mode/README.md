# watch-mode

Emacs minor mode for watching a directory and automatically re-running a shell command on file changes.

## Features

- Watches a directory recursively for file changes (create, modify, delete, rename)
- Re-runs a user-specified shell command on each change
- Displays command output in a read-only buffer with timestamps
- Debounced execution (0.3s by default, configurable via `watch-debounce-interval`)
- Support for multiple concurrent watch buffers

## Installation

### Manual

Clone or copy the `watch-mode` directory into your Emacs load path, then add to `init.el`:

```elisp
(add-to-list 'load-path "~/.emacs.d/watch-mode")
(require 'watch-mode)
```

### use-package

```elisp
(use-package watch-mode
  :load-path "~/.emacs.d/watch-mode"
  :bind ("C-c w" . watch))
```

### straight.el

```elisp
(use-package watch-mode
  :straight (watch-mode
             :type git
             :host github
             :repo "xieyuheng/meta-lisp"
             :files ("editors/emacs/watch-mode/*.el"))
  :bind ("C-c w" . watch))
```

## Usage

```
M-x watch
```

Prompts:

| Prompt | Default | Description |
|--------|---------|-------------|
| Watch directory | `default-directory` | Directory to watch recursively |
| Command | (none) | Shell command to run on changes |

Output appears in a read-only buffer named `*watch: <dir>*`.

### Key bindings in watch buffer

| Key | Command |
|-----|---------|
| `g` | `watch-rerun` — manually re-run the command |
| `q` | `quit-window` — close the window |

The buffer's `kill-buffer-hook` automatically cleans up file watches and kills any running process.

### Example

From a `.meta` project directory:

```
M-x watch
Watch directory: src/
Command: ./scripts/check-with-date.sh
```

Every time a file in `src/` changes, `check-with-date.sh` re-runs and the output updates in `*watch: .../src/*`.

## Customization

- `watch-debounce-interval` (default `0.3`) — seconds to wait after last file change before re-running
