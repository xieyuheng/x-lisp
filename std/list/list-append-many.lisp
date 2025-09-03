(import-all "list-append.lisp")

(export list-append-many)

(define (list-append-many lists)
    (if (list-empty? lists)
      []
      (list-append
       (car lists)
       (list-append-many (cdr lists)))))
