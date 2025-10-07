(export identity constant)

(claim identity
  (polymorphic (A)
    (-> A A)))

(define (identity x) x)

(claim constant
  (polymorphic (A)
    (-> A anything?
        A)))

(define (constant x y) x)
