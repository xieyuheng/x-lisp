(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))

(begin
  (= l (li 1 nil))
  (assert-equal (li 2 nil) (li-put-head! 2 l))
  (assert-equal (li 2 nil) l))
