# about file

[builtin] open-input-file & open-output-file
[builtin] file-close
[builtin] file-size
[builtin] file-read
[builtin] file-write & file-writeln
[builtin] file-print & file-println

# about path

path-base-name
path-directory-name

path-extension -- with dot
path-stem
path-full-extension
path-stem-full

path-absolute?
path-relative?

path-join
path-canonicalize

# about fs

fs-exists?
fs-file?
fs-directory?

fs-read
fs-write

fs-directory-contents
fs-directory-contents-recursive

fs-directory-entries -- with type info
fs-directory-entries-recursive

fs-make-directory

fs-delete-file
fs-delete-directory
fs-delete-recursive

fs-rename

# about process and module

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
