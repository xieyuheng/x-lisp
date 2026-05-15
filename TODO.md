[meta-lisp.js] 在 LocatePass 中把参数充足的 box-get 转化为 box-get-with-location

[meta-lisp.js] desugarLetrecStar 在代码前，用注释给出翻译例子，例子使用 box 而不是 list

```scheme
(letrec* ((x1 e1)
          (x2 e2)
          ...
          (xn en))
  body)
```

编译成：

```scheme
(let ((x1 (make-box))
      (x2 (make-box))
      ...
      (xn (make-box)))
  (box-put! e1 x1)
  (box-put! e2 x2)
  ...
  (box-put! en xn)
  body)
```

其中 e1 e2 en 和 body
中的 x1 x2 xn
都要替换为 (box-get x1) (box-get x2) (box-get xn)

注意：

- 你可以润色一下例子中的措辞，让例子更清晰。

[meta-lisp.js] 修复 desugarLetrecStar，使用 box 而不是 list，按照注释所描述的方式翻译。

[meta-lisp.js] 修复 letrec 的 desugarLetrec，在代码中给出翻译例子
[meta-lisp.js] 修复 letrec-sequential-binding-error.meta


[meta-lisp.js] 可否先实现一个 `expIsCore` 函数来明确哪些是 desugar 之后的核心语法？
[meta-lisp.js] 实现一个 `expNaiveSubst` 不处理 capture avoidance，只处理 bound variable shadowing

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
