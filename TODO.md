[meta-builtin.meta] 修复 box-get-with-location

其中

```scheme
(write (format-message-with-source-location "box is empty" location))
```

向 stdout 打印了，但是我们需要像 stderr 打印。
向 stdout 打印 是 (write) 的行为。
如何设计新的 API 向 stderr 打印？

[meta-lisp.js] 可否先实现一个 `expIsCore` 函数来明确哪些是 desugar 之后的核心语法？
[meta-lisp.js] 实现一个 `expNaiveSubst` 不处理 capture avoidance，只处理 bound variable shadowing

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
