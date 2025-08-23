(import-all "list-append.lisp")

(define (list-append-many lists)
    (if (list-empty? lists)
      []
      (list-append
       (car lists)
       (list-append-many (cdr lists)))))
