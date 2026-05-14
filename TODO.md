# local (define)

[meta-lisp.js] 增加 `(letrec)` 语法

---

[plan] [meta-lisp.js] 增加 `(letrec)` 语法

- 增加 `Letrec` 到 `Exp` -- 模仿 `LetrecStar`
- 在 parseExp 中 语法解析 `(letrec)` -- 模仿 `(letrec*)`
- 在 DesugarPass 中，用 `desugarLetrec` 把 `(letrec)` 转化为 `(letrec*)`，
  具体方法如下：

(letrec ((x1 e1)
         (x2 e2)
         ...
         (xn en))
  body)

转化为：

(letrec* ((t1 (lambda () e1))
          (t2 (lambda () e2))
          ...
          (tn (lambda () en))
          (x1 (t1))
          (x2 (t2))
          ...
          (xn (tn)))
  body)

- 其中 t1 t2 tn 都是临时生成的 name。
  生成 name 的时候，可以用 x1 x2 xn 作为 base，然后加 .thunk，
  然后再调用 generateRelativeFreshName，在合适的 usedNames 语境下生成新的临时 name。

---

[meta-lisp.js] support using `(define)` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
