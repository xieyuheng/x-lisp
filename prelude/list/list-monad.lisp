(import-all "../function")
(import-all "list-map")
(import-all "list-append-many" )

(export list-append-map list-unit list-lift list-bind)

(define (list-append-map f list)
  (list-append-many (list-map f list)))

(define (list-unit x) [x])
(define list-lift list-append-map)
(define list-bind (swap list-lift))
