(claim main (-> void-t))

(define (main)
  (println (the (set-t int-t) (@set 1 2 3))))
