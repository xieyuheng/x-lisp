(export
  identity
  identity-unless
  constant)

(claim identity
  (polymorphic (A)
    (-> A A)))

(define (identity x) x)

(claim identity-unless
  (polymorphic (A B)
    (-> bool? (-> A B)
        (-> A B))))

(define (identity-unless b f)
  (if b f identity))

(claim constant
  (polymorphic (A)
    (-> A anything?
        A)))

(define (constant x y) x)
