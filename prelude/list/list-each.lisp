(export list-each)

(define (list-each f list)
  (if (list-empty? list)
    void
    (begin
      (f (car list))
      (list-each f (cdr list)))))
