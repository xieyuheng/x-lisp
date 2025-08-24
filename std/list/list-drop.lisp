(claim list-drop
  (-> (list? anything?) (int-smaller-or-equal? 0)
      (list? anything?)))

(define (list-drop list n)
  (if (or (equal? n 0) (list-empty? list))
    list
    (list-drop (cdr list) (isub n 1))))
