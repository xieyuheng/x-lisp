(import-all "../function/index.lisp")
(import-all "list-map.lisp")
(import-all "list-append-many.lisp" )

(define (list-append-map f list)
  (list-append-many (list-map f list)))

(define (list-unit x) [x])
(define list-lift list-append-map)
(define list-bind (swap list-lift))
