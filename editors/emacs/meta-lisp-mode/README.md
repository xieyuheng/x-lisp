# meta-lisp-mode

Emacs major mode for editing [meta-lisp](https://github.com/xieyuheng/meta-lisp) source files (`.meta`).

## Features

- **Syntax highlighting**: special forms, types (`*-t`), keywords (`:key`), `@`-prefixed forms, qualified names (`module/name`), numbers, strings, comments
- **Indentation**: proper indentation for all meta-lisp keyword forms (`define`, `lambda`, `let`, `if`, `cond`, `match`, etc.) with configurable spec rules
- **Bracket support**: `[]` and `{}` use simple body indentation (as literal containers, not function calls)
- **S-expression navigation**: `forward-sexp` works with `()` `[]` `{}`
- **Comment handling**: `;` for line comments, `;;` by default in `comment-region`

## Installation

### Manual

Clone or copy the `meta-lisp-mode` directory into your Emacs load path, then add to `init.el`:

```elisp
(add-to-list 'load-path "~/.emacs.d/lisp/meta-lisp-mode")
(require 'meta-lisp-mode)
```

### use-package

```elisp
(use-package meta-lisp-mode
  :load-path "~/.emacs.d/lisp/meta-lisp-mode"
  :mode "\\.meta\\'")
```

### straight.el

```elisp
(use-package meta-lisp-mode
  :straight (meta-lisp-mode
             :type git
             :host github
             :repo "xieyuheng/meta-lisp"
             :files ("editors/emacs/meta-lisp-mode/*.el"))
  :mode "\\.meta\\'")
```

## Usage

`.meta` files are automatically associated with `meta-lisp-mode`. Open any `.meta` file and the mode activates.

Manual activation:

```
M-x meta-lisp-mode
```

### Key bindings

Inherits standard `prog-mode` bindings plus:

| Key | Command |
|---|---|
| `TAB` | `meta-lisp-indent-line` |
| `C-M-f` / `C-M-b` | Forward / backward sexp (works with `()` `[]` `{}`) |
| `C-M-u` | Backward up list |
| `M-;` | Comment / uncomment (defaults to `;;`) |

## Running tests

```sh
cd editors/emacs/meta-lisp-mode
./test.sh
```

Or manually:

```sh
emacs -batch \
  -L . \
  -l meta-lisp-syntax.el \
  -l meta-lisp-font-lock.el \
  -l meta-lisp-indent.el \
  -l meta-lisp-mode.el \
  -l meta-lisp-test.el \
  -f ert-run-tests-batch-and-exit
```
