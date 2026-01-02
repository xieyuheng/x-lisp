(define (main)
  (= y 6)
  (begin
    (= x (begin
           (= y (ineg 42))
           y))
    (println (iadd x y))))
