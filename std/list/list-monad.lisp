(import-all "../function/index.lisp")
(import-all "list-map.lisp")
(import-all "list-append-many.lisp" )

(define (list-append-map list f)
  (list-append-many (list-map f list)))

(define (list-unit x) [x])
(define list-bind list-append-map)
(define list-lift (swap list-bind))
