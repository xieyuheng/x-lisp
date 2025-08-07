(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))
