# Vim/Neovim support for meta-lisp

Syntax highlighting, indentation, and file-type detection for `.meta` files.
Compatible with both Vim (8+) and Neovim.

## Installation

### Manual

Copy the files to your editor's config directory:

**Vim:**

```sh
cp -r ftdetect ftplugin syntax indent ~/.vim/
```

**Neovim:**

```sh
cp -r ftdetect ftplugin syntax indent ~/.config/nvim/
```

### Pathogen

```sh
ln -s "$(pwd)" ~/.vim/bundle/meta-lisp
```

### vim-plug

```vim
Plug '~/projects/meta-lisp', { 'rtp': 'editors/vim/meta-lisp' }
```

### lazy.nvim

```lua
{ dir = '~/projects/meta-lisp', dir = 'editors/vim/meta-lisp' }
```

## Features

### Syntax highlighting

| Highlight group          | Matches                                              |
|--------------------------|------------------------------------------------------|
| `metaLispComment`        | `;` line comments                                    |
| `metaLispString`         | `"..."` strings                                      |
| `metaLispSpecialForm`    | `define`, `lambda`, `let`, `if`, `match`, `module`... |
| `metaLispAtForm`         | `@list`, `@set`, `@hash`, `@quote`, `@record`        |
| `metaLispConstant`       | `true`, `false`, `void`                              |
| `metaLispType`           | `int-t`, `float-t`, `string-t`, `list-t`, `box-t`... |
| `metaLispKeywordValue`   | `:key`, `:name`...                                   |
| `metaLispQualifiedName`  | `module/name`                                        |
| `metaLispNumber`         | `42`, `-1`, `3.14`                                   |
| `metaLispQuoteSymbol`    | `'foo`                                               |
| `metaLispParen`          | `(`, `)`                                             |
| `metaLispBracket`        | `[`, `]`                                             |

### Indentation

Two distinct indentation behaviors:

- **`[]` brackets** — literal list syntax (like Clojure vectors).

- **`()` parentheses** — keyword-driven. 43 special forms have indent specs (0 = all children body, 1 = first child special). Non-keyword forms use function-call alignment.

### File-type settings

- `commentstring` set to `; %s`
- `iskeyword` extended with meta-lisp identifier characters (`@`, `-`, `?`, `!`, `/`, etc.)
- 2-space `expandtab` by default

## Custom highlight colors

Override in your vimrc/init.lua:

```vim
hi metaLispSpecialForm ctermfg=75 guifg=#5fafff
hi metaLispType         ctermfg=180 guifg=#d7af87
```

## Test file

Open `test/meta-lisp.meta` to verify syntax highlighting and press `=G` to test indentation.
