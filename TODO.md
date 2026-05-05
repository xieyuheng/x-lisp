[meta-lisp.meta] `parse-project-config-from-sexp`

- 下面利用 `sexp-collect-key-value-pairs` 实现 `parse-project-config-from-sexp`

- 实现之后写一些简单的测试。

- 注意，你可以在 projects/meta-lisp.meta 中：

  调用 ./meta-lisp.js check 来做类型检查。
  调用 ./meta-lisp.js test 来做测试。

[meta-lisp.meta] `load-project-config`
[meta-lisp.meta] `load-project`
[meta-lisp.meta] `check-pipeline`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`
