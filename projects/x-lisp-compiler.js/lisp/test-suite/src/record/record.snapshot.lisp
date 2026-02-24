(claim main (-> void-t))

(define (main)
  (println '(:x a :y b))
  (println [:x 'a :y 'b])
  (println (@record :x 'a :y 'b))
  (println (@tael :x 'a :y 'b)))
