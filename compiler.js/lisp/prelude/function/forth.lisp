(export
  swap drop dup)

(claim swap
  (polymorphic (A B C)
    (-> (-> A B C)
        (-> B A C))))

(define (swap f x y) (f y x))

(claim drop
  (polymorphic (A B)
    (-> (-> A B)
        (-> anything? A B))))

(define (drop f)
  (lambda (dropped x) (f x)))

(claim dup
  (polymorphic (A B)
    (-> (-> A A B)
        (-> A B))))

(define (dup f)
  (lambda (x) (f x x)))
