(export-all)

(define-data (my-list-t E)
  nil
  (li (head E) (tail (my-list-t E))))
