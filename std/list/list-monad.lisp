(import "list-map.lisp" list-map)

(define (list-append-map list f)
  (list-append-many (list-map list f)))

(define (list-lift f list) (list-append-map list f))
(define (list-unit x) [x])
