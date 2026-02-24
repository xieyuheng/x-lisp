(claim main (-> void-t))

(define (main)
  (assert-equal "abcdef" (string-append "abc" "def")))
