(claim main (-> void-t))

(define (main)
  (= x 1)
  (println
   (iadd x (begin
             (= x (begin
                    (= y 5)
                    (iadd y x)))
             (iadd x 100)))))
