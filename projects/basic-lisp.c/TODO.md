# builtin about sexp

remove `path` from `lexer_t`
`parse_sexps` -- should not take `path`
`parse_located_sexps` -- take `path_string` instead of `path`

[builtin] `parse-located-sexps`

[builtin] `error-with-source-location`
[builtin] `assert-with-source-location`

[helpers.c] improve `string_builder_t` for `format_*`

[sexp] `sexp_format`
[sexp] `sexp_print`
[sexp] `sexp.snapshot` -- call `sexp_print`

[builtin] format

# builtin about file

;; low level

file-t

open-file
open-input-file
open-output-file

call-with-file
call-with-input-file
call-with-output-file

file-close

file-size

file-read
file-write
file-writeln
file-print
file-println

;; high level

path-exist?
path-file?
path-directory?

path-read
path-write

path-directory-contents
path-directory-contents-recursive

path-directory-entries -- with type info
path-directory-entries-recursive

path-make-directory

path-delete-file
path-delete-directory
path-delete-recursive

path-rename

;; about path

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

;; about process and module

current-working-directory
current-module-file
current-module-directory
