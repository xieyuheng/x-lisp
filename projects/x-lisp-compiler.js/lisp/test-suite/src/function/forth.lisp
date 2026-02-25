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
  (= g (dup identity))
  (println (g f f)))
