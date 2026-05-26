[meta-lisp.js] add (@sexp) syntax

- 下面我计划增加 (@sexp <exp>) 语法，类似 (@quote <exp>)
- desugarSexp 与 desugarQuote 类似，但是不是直接返回对应的 literal exp，
  而是利用 location 返回带有 location，属于 sexp-t 类型的表达式（meta-lisp 内的 adt）。

- 我刚刚抽出来了 `desugarLocation` 函数（在 120-LocatePass 中用到）。

  我的意思是，我们可以用这个 `desugarLocation` 函数，
  让 (@sexp) 生成符合 meta-lisp 中 sexp-t 类型的数据：

(define-enum sexp-t
  (symbol-sexp (content symbol-t) (location source-location-t))
  (keyword-sexp (content keyword-t) (location source-location-t))
  (string-sexp (content string-t) (location source-location-t))
  (int-sexp (content int-t) (location source-location-t))
  (float-sexp (content float-t) (location source-location-t))
  (list-sexp (elements (list-t sexp-t))
             (location source-location-t)))

  你可以注意到，想要生成这样的数据，
  就必须要 desugarLocation 这样的辅助函数。

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

[meta-lisp.meta] [refactor] parse-exp

[skill] how to solve it
[skill] sandi metz oop
[skill] scalable-c
