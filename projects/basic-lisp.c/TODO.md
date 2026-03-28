# builtin about sexp

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
file-status

file-read
file-write
file-writeln
file-print
file-println

;; high level

path-exist?
path-regular-file?
path-directory?

path-read
path-write

path-directory-contents
path-directory-contents-recursive

path-make-directory

;; about path

path-file-name (path-name)
path-directory-name (path-parent)

path-absolute?
path-relative?

path-join
path-canonicalize (path-normalize)

;; about process and module

(current-working-directory)

(current-module-file)
(current-module-directory)
