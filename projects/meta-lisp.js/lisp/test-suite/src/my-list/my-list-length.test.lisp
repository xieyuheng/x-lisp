(import-all "my-list")
(import-all "my-list-length")

(claim main (-> void-t))

(define (main)
  (assert-equal 0 (my-list-length nil))
  (assert-equal 3 (my-list-length (li 1 (li 2 (li 3 nil))))))
