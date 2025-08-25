(claim list-drop
  (-> int-non-negative? (list? anything?)
      (list? anything?)))

(define (list-drop n list)
  (if (or (equal? n 0) (list-empty? list))
    list
    (list-drop (isub n 1) (cdr list))))
