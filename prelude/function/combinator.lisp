(export identity constant swap)

(define (identity x) x)
(define (constant x y) x)
(define (swap f x y) (f y x))
