# setup feedback loop

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift

- support recursive and mutual recursive function

# frequent prompts

- 注意，在修改之后，为了检查修改的正确性，你需要 [meta-lisp.meta] 中：

  - 调用 sh scripts/check.sh 做类型检查。
  - 调用 sh scripts/test.sh 做测试。
  - 调用 sh scripts/self-check.sh 用 self-hosting 编译器做类型检查。
