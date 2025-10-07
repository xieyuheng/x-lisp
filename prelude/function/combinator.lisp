(export
  identity constant
  with-default-argument)

(claim identity
  (polymorphic (A)
    (-> A A)))

(define (identity x) x)

(claim constant
  (polymorphic (A)
    (-> A anything?
        A)))

(define (constant x y) x)

(claim with-default-argument
  (polymorphic (A B)
    (-> A (-> A B)
        (-> (optional? A) B))))

(define (with-default-argument default f)
  (lambda (x)
    (if (null? x)
      (f default)
      (f x))))
