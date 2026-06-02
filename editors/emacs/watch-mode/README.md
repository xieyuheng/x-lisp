# watch-mode

A read-only Emacs major mode for running CLI watch scripts.

## Problem

Running `watch.sh` scripts in `M-x shell` or `eshell` works, but the
buffer grows indefinitely. When the script clears the screen (via
`entr -c`, `tsc --watch`, etc.), Emacs just appends more text instead
of truly erasing the previous output.

## How it works

Watch-mode runs a command as an async process in a read-only buffer.
The process filter intercepts ANSI clear-screen sequences (`\033[H\033[2J`,
`\033[2J\033[H`, `\033c`, etc.). When detected, the entire buffer is
erased before inserting the fresh output. All ANSI escape codes are
stripped for clean display.

Handles escape sequences split across process filter calls (common
when output arrives in chunks).

## Usage

```elisp
(add-to-list 'load-path "~/.emacs.d/watch-mode")
(require 'watch-mode)
```

```
M-x watch
```

Prompts for a command (default `./scripts/watch.sh`). Opens a
`*watch*` buffer and runs the command.

## Keybindings

| Key       | Action                            |
|-----------|-----------------------------------|
| `q`       | Kill process and close buffer     |
| `g`       | Restart the watch process         |
| `C-c C-k` | Kill process, keep buffer         |
| `C-c C-c` | Kill process and close buffer     |

All standard `special-mode` bindings are inherited.

## Customization

```elisp
;; Default command for M-x watch
(setq watch-default-command "npx tsc --noEmit --watch")

;; Buffer name (default "*watch*")
(setq watch-buffer-name "*my-watch*")

;; Enable/disable auto-scroll (default t)
(setq watch-auto-scroll nil)
```

## Requirements

- Emacs 25.1+
