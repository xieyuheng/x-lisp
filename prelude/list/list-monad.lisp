(import-all "../function")
(import-all "list-map")
(import-all "list-concat" )

(export
  list-lift
  list-unit
  list-bind)

(claim list-lift
  (polymorphic (A B)
    (-> (-> A (list? B)) (list? A)
        (list? B))))

(define (list-lift f list)
  (list-concat (list-map f list)))

(claim list-unit
  (polymorphic (A)
    (-> A (list? A))))

(define (list-unit x) [x])

(define list-bind (swap list-lift))
