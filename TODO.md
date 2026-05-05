[meta-lisp.meta] refactor  `parse-project-config-from-sexp`

- 在 [meta-builtin.meta] 中，在 sexp-collect-key-value-pairs 之外，
  加上一个辅助函数 sexp-collect-key-value-hash。

  这样实现 parse-project-config-from-sexp 的时候，
  就不用自己实现 lookup 函数了，直接用 hash 的 API 就可以了。

  hash 的 API 可以在 [meta-builtin.meta] 项目中找到。

[meta-lisp.meta] `load-project-config`
[meta-lisp.meta] `load-project`
[meta-lisp.meta] `check-pipeline`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`
