(claim main (-> void-t))

(define (main)
  (= y (begin
         (= x 20)
         (begin
           (= z 22)
           (iadd x z))))
  (println y))
