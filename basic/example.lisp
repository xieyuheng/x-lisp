(define (main)
  (block label
    (= v0 (const 1))
    (= v1 (const 2))
    (= v2 (iadd v0 v1)))
  (block label
    (print v2)
    (= v3 (alloc v0))
    (free v3)))
如果变量不带类型的 assign 语法是 (= v2 (iadd v0 v1))
那么变量带有类型的 assign 语法应该如何设计？
(= (the int? v2) (iadd v0 v1))
可以吗？
