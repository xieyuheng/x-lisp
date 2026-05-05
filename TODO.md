[meta-builtin.meta] `sexp-collect-key-value-pairs`

- 把 [sexp.js] 的 src/collectKeyValuePairs.ts
  迁移到 [meta-builtin.meta] 的 src/sexp/sexp-collect-key-value-pairs.meta

- sexp-collect-key-value-pairs 的类型应是：

  ```meta-lisp
  (claim sexp-collect-key-value-pairs (-> (list-t sexp-t) (list-t (pair-t keyword-t sexp-t))))
  ```

- 注意，meta-lisp 中没有「循环」相关控制流，需要用尾部递归函数实现「循环」。

[meta-lisp.meta] `parse-project-config`
[meta-lisp.meta] `load-project-config`
[meta-lisp.meta] `load-project`
[meta-lisp.meta] `check-pipeline`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`
