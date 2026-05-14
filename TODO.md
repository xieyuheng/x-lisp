# local (define)

[meta-lisp.js] 新增 `(letrec*)` 语法

---

[plan] [meta-lisp.js] 新增 `(letrec*)` 语法

```scheme
(letrec* ((x1 e1)
          (x2 e2)
          ...
          (xn en))
  body)
```

编译成：

```scheme
(let ((x1 (@list))      ; 每个变量绑定到一个 @list，初始内容为占位符
      (x2 (@list))
      ...
      (xn (@list)))
  (list-push! e1 x1)             ; 顺序求值 e1，存入 x1 的 list
  (list-push! e2 x2)               ; e2 中可以引用 x1（通过 (list-get 1 x1) 获取值）
  ...
  (list-push! en xn)             ; en 中可以引用 x1..x_{n-1}
  (begin                       ; 进入 body，其中每个 xi 都是 box
    body))                     ; body 中需显式使用 (unbox xi) 访问值
```

其中 e1 e2 en 和 body
中的 x1 x2 xn
都要替换为 (list-get 1 x1) (list-get 1 x2) (list-get 1 xn)

对表达式的替换，使用 `expSubst`。

你需要：

- 新增 `LetrecStar` `Exp` -- 模仿 `LetStar`
- 在 parseExp 中解析 `(letrec*)` 语法，模仿 `(let*)`
- 在 `DesugarPass` 中，实现 `desugarLetrecStar`，完成上述 letrec* 到 let 的转换。

---


[meta-lisp.js] support using `(define)` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
