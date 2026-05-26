---

[meta-lisp.js] 关于 (@list) 语法

我们现在的 desugar 会不会有 bug？

(@list a b c)      ;; 解析为 list-exp { elements: [a, b, c] }
    ↓ desugar
(begin             ;; desugarList.ts
  (= list (builtin/make-list))
  (builtin/list-push! a list)
  (builtin/list-push! b list)
  (builtin/list-push! c list)
  list)

desugar 时用到了 list 变量，如果 list 变量就是 a b c 中的某一个怎么办？

---

[meta-lisp.meta] [refactor] parse-exp

[skill] how to solve it
[skill] sandi metz oop
[skill] scalable-c
