(claim main (-> void-t))

(define (main)
  (println
   (if (and (equal? (random-dice) 1)
            (equal? (random-dice) 2))
     0
     42)))
