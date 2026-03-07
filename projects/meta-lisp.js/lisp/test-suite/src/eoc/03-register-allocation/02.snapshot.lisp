;; figure-3.2

(claim main (-> void-t))

(define (main)
  (= x (random-dice))
  (= y (random-dice))
  (println (iadd (iadd x y) 42)))
