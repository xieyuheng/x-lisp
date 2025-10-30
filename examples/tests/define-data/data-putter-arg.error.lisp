(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))

(begin
  (= l (li 1 nil))
  (li-put-tail! 2 l))
