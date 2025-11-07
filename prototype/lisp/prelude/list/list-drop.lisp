(export list-drop)

(claim list-drop
  (polymorphic (A)
    (-> int-non-negative? (list? A)
        (list? A))))

(define (list-drop n list)
  (if (or (equal? n 0) (list-empty? list))
    list
    (list-drop (isub n 1) (cdr list))))
