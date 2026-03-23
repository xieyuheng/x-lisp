(claim main (-> void-t))

(define (main)
  (= x 1)
  (println
   (iadd x (begin
             (= x (begin
                    (= x 5)
                    (iadd x x)))
             (iadd x 100)))))
