# setup feedback loop

[meta-lisp.meta] `check-pipeline` -- call first pass
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift

- support recursive and mutual recursive function

# frequent prompts

- 注意，你可以在 [meta-lisp.meta] 中：

  - 调用 ./meta-lisp.js check 做类型检查。
  - 调用 ./meta-lisp.js test 做测试。
