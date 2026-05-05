[sexp.js] extract `collectKeyValuePairs` -- from list of `Sexp`
[meta-builtin.meta] rename `located-sexp-t` to `sexp-t` -- like `exp-t` always have `location`
[stack-lisp.c] rename `parse-located-sexps` `parse-sexps` -- always have `location`
[meta-builtin.meta] `sexp-collect-key-value-pairs`

[meta-lisp.meta] `parse-project-config`
[meta-lisp.meta] `load-project-config`
[meta-lisp.meta] `load-project`
[meta-lisp.meta] `check-pipeline`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`
