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
call-with-file

open-input-file
open-output-file
call-with-input-file
call-with-output-file

file-close
file-read
file-write
file-writeln
file-print
file-println

;; high level

path-exist?
path-to-file?
path-to-directory?

path-read
path-write
path-writeln
path-print
path-println
