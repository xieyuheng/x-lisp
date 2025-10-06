(import-all "../function")
(import-all "list-map")
(import-all "list-concat" )

(export list-append-map list-unit list-lift list-bind)

(claim list-append-map
  (polymorphic (A B)
    (-> (-> A (list? B)) (list? A)
        (list? B))))

(define (list-append-map f list)
  (list-concat (list-map f list)))

(claim list-unit
  (polymorphic (A)
    (-> A (list? A))))

(define (list-unit x) [x])

(define list-lift list-append-map)
(define list-bind (swap list-lift))
