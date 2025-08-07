(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))

nil
(li 1 (li 2 (li 3 nil)))
