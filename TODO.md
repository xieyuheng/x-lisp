# algebraic type

[meta-lisp.js] 设计新的语法 `(define-algebraic-type)`：

```scheme
(define-algebraic-type <type-name>
  ((<constructor-name> (<field-name> <field-type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)

(define-algebraic-type (<type-name> <type-parameter> ...)
  ((<constructor-name> (<field-name> <field-type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)
```

例如：

```scheme
(define-algebraic-type (my-list-t E)
  ((nil)
   nil?)
  ((li (head E) (tail (my-list-t E)))
   li?
   (head li-head li-put-head!)
   (tail li-tail li-put-tail!)))
```

使得 `(define-enum)`：

```scheme
(define-enum (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))
```

可以展开为带有 explicit 的 <predicate-name>、<accessor-name> 和 <modifier-name>
的 `(define-algebraic-type)` 语法。

部分相关代码为：

- 需要增加 `DefineAlgebraicType` 到 `Stmt`。
- 需要在 parseStmt 中解析 `(define-algebraic-type)`。
- 在 008-ExecutePass 的 `executeStmt` 的过程中，
  和处理 `DefineEnum` 类似，也是生成 `AlgebraicTypeDefinition`。
- 在 006-ExpandPass 的 `expandStmt` 过程中，
  在处理 `DefineEnum` 类似，但是不用拼接 symbol 而得到相关的名字了。


[meta-lisp.js] `DefineStruct`
[meta-lisp.js] `DefineEnum` desugar to `DefineAlgebraicType`
[meta-lisp.js] `DefineStruct` to desugar to `DefineAlgebraicType`

[meta-lisp.js] give `{}` sugar to `(@hash)` -- like clojure

# setup feedback loop

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
