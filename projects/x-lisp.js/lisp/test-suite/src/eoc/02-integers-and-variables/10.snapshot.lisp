(claim main (-> void-t))

(define (main)
  (= x (iadd (iadd 1 2) (iadd 3 4)))
  (println (iadd x 5)))
