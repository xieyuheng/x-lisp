(define (swap f x y) (f y x))

(define (drop f)
  (lambda (dropped)
    (lambda (x)
      (f x))))

(define (dup f)
  (lambda (x)
    (f x x)))

(define (identity x) x)

(begin
  (= f identity)
  (= g (dup identity))
  (g f f))
