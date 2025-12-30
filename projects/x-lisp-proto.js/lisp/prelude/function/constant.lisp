(export constant)

(claim constant
  (polymorphic (A)
    (-> A any?
        A)))

(define (constant x y) x)
