(claim swap
  (polymorphic (X Y Z)
    (-> (-> Y X Z) (-> X Y Z))))

(define (swap f x y) (f y x))

(claim drop
  (polymorphic (X Y Z)
    (-> (-> X Z) (-> Y X Z))))

(define (drop f)
  (lambda (dropped)
    (lambda (x)
      (f x))))

(claim dup
  (polymorphic (X Z)
    (-> (-> X X Z) (-> X Z))))

(define (dup f)
  (lambda (x)
    (f x x)))

(claim identity
  (polymorphic (A)
    (-> A A)))

(define (identity x) x)

(claim main (-> void-t))

(define (main)
  (= f identity)
  (= square (dup imul))
  (println (square (f 1)))
  (println (square (f 2)))
  (println (square (f 3)))
  (println (square (f 4))))
