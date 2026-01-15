(define (main)
  (= list (make-list))
  (list-push! 1 list)
  (list-push! 2 list)
  (list-push! 3 list)
  (assert-equal [1 2 3] list)

  (assert-equal [1 2 3] '(1 2 3))
  (assert-equal ['a 'b 'c] '(a b c))

  (assert-equal 3 (list-length [1 2 3]))
  (assert-equal 0 (list-length []))
  (assert (list-empty? [])))
