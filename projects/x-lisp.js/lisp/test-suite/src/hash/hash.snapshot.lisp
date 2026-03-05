(claim main (-> void-t))

(define (main)
  (println (@hash))
  (println (@hash 1 2))
  (println (@hash 1 3))
  (println (@hash 1 2 3 4)))
