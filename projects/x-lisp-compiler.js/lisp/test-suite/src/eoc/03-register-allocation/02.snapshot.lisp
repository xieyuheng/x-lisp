;; figure-3.2

(define (main)
  (= x (random-dice))
  (= y (random-dice))
  (println (iadd (iadd x y) 42)))
