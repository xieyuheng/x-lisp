(define (main)
  (= x (begin (= x 4)
                    (iadd x 1)))
  (println (iadd x 2)))
