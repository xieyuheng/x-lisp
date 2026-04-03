[value] `xfile_write`

# builtin about file

open-input-file
open-output-file
file-close
file-read
file-write & file-writeln
file-print & file-println

# builtin about path

path-base-name
path-directory-name
path-extension
path-stem
path-absolute?
path-relative?
path-join
path-normalize

# builtin about fs

fs-exists?
fs-file?
fs-directory?
fs-read
fs-write
fs-list-directory
fs-list-directory-recursive
fs-make-directory
fs-delete-file
fs-delete-directory
fs-delete-recursive
fs-rename

# builtin about process and module

current-working-directory
current-module-file
current-module-directory

# about source-location

[builtin] `error-with-source-location`
[builtin] `assert-with-source-location`

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[sexp] `sexp_format`
[sexp] `sexp_print`
[sexp] `sexp.snapshot` -- call `sexp_print`

[builtin] [maybe] `format-sexp`
