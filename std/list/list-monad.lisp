(import-all "list-map.lisp")
(import-all "list-append-many.lisp" )

(define (list-append-map list f)
  (list-append-many (list-map list f)))

(define (list-unit x) [x])
(define (list-lift f list) (list-append-map list f))
