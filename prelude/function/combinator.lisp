(export identity constant swap)

(claim identity
  (polymorphic (A)
    (-> A A)))

(define (identity x) x)

(claim constant
  (polymorphic (A)
    (-> A anything?
        A)))

(define (constant x y) x)

(claim swap
  (polymorphic (A B C)
    (-> (-> A B C)
        (-> B A C))))

(define (swap f x y) (f y x))
