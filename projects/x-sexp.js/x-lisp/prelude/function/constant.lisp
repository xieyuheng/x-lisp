(export constant)

(claim constant
  (polymorphic (A)
    (-> A anything?
        A)))

(define (constant x y) x)
