(import-all "../schema")

(export
  set-select
  set-reject)

(claim set-select
  (polymorphic (A)
    (-> (-> A bool?) (set? A)
        (set? A))))

(define (set-select p set)
  (= new-set {})
  (set-each
   (lambda (e)
     (if (p e)
       (set-add! e new-set)
       void))
   set)
  new-set)

(claim set-reject
  (polymorphic (A)
    (-> (-> A bool?) (set? A)
        (set? A))))

(define (set-reject p set)
  (set-select (negate p) set))
