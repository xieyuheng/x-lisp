;; figure-3.1

(claim main (-> void-t))

(define (main)
  (= v 1)
  (= w 42)
  (= x (iadd v 7))
  (= y x)
  (= z (iadd x w))
  (println (iadd z (ineg y))))
