(define (list-drop list n)
  (if (or (equal? n 0) (list-empty? list))
    list
    (list-drop (cdr list) (isub n 1))))
