(export
  set-select
  set-reject)

(define (set-select p set)
  (= new-set {})
  (set-each
   (lambda (e)
     (if (p e)
       (set-add! e new-set)
       void))
   set)
  new-set)

(define (set-reject p set)
  (set-select (negate p) set))
