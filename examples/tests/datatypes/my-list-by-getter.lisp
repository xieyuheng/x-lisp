(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))

(define (length target)
  (if (nil? target)
    0
    (iadd 1 (length (li-tail target)))))

(define (append target list)
  (if (nil? target)
    list
    (li (li-head target)
        (append (li-tail target) list))))
