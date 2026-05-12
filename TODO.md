# algebraic type

[meta-lisp.js] 增加 `(define-struct)` 语法

- 与 `(define-enum)` 类似，也是 desugar 到 `(define-algebraic-type)`
- 与 `(define-enum)` 不同的是，`(define-struct)` 只有一个 constructor。

  比如：

  ```scheme
  (define-struct point-t
    (x ))
  ```

  又比如：

  ```scheme
  (define-struct (pair-t A B))
  ```

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
