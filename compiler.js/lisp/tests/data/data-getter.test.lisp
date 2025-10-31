(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))

(begin
  (= l (li 1 (li 2 nil)))
  (assert-equal 1 (li-head l))
  (assert-equal 2 (li-head (li-tail l)))
  (assert-equal (li 2 nil) (li-tail l))
  (assert-equal nil (li-tail (li-tail l))))
