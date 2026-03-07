(claim main (-> void-t))

(define (main)
  (println
   (iadd 1 (iadd (random-dice) 1))))
