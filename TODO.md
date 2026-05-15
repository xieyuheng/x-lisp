[meta-lisp.js] 修复 letrec 的 desugarLetrec

当前的转化方式是：

```scheme
(letrec ((x1 e1)
         (x2 e2)
         ...
         (xn en))
  body)
```

转化为：

```scheme
(letrec* ((t1 (lambda () e1))
          (t2 (lambda () e2))
          ...
          (tn (lambda () en))
          (x1 (t1))
          (x2 (t2))
          ...
          (xn (tn)))
  body)
```

这是不对的。

应该转化为：

```scheme
(let ((x1 (make-box))
      (x2 (make-box))
      ...
      (xn (make-box)))
  (let ((v1 e1)
        (v2 e2)
        ...
        (vn en))
    (box-put! x1 v1)
    (box-put! x2 v2)
    ...
    (box-put! xn vn)
    body))
```

e1 e2 en 和 body 中的 x1 x2 xn 都被相应的替换。

请修复这个转化。

并且把正确的转化例子作为注释写在 desugarLetrec 开头，力求清晰。




[meta-builtin.meta] 修复 box-get-with-location

其中

```scheme
(write (format-message-with-source-location "box is empty" location))
```

向 stdout 打印了，但是我们需要像 stderr 打印。
向 stdout 打印 是 (write) 的行为。
如何设计新的 API 向 stderr 打印？

[meta-lisp.js] 修复 letrec-sequential-binding-error.meta

[meta-lisp.js] 可否先实现一个 `expIsCore` 函数来明确哪些是 desugar 之后的核心语法？
[meta-lisp.js] 实现一个 `expNaiveSubst` 不处理 capture avoidance，只处理 bound variable shadowing

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
