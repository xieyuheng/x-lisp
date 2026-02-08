(export
  ;; my-list?
  nil
  ;; nil?
  li
  ;; li?
  li-head
  li-tail
  li-put-head
  li-put-tail
  li-put-head!
  li-put-tail!)

(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))
