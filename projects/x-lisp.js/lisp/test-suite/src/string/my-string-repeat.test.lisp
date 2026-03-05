(import-all "my-string-repeat")

(claim main (-> void-t))

(define (main)
  (assert-equal "" (my-string-repeat 0 "a"))
  (assert-equal "a" (my-string-repeat 1 "a"))
  (assert-equal "aa" (my-string-repeat 2 "a"))
  (assert-equal "aaa" (my-string-repeat 3 "a")))
