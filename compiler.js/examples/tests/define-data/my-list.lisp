(export my-list?
        nil
        nil?
        li
        li?
        li-head
        li-tail)

(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))
