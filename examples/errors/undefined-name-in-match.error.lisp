(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))

(define (length target)
  (match target
    (nil 0)
    ((li head tail) (iadd 1 (length tal)))))
