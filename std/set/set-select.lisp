(export set-select)

(define (set-select p set)
  (= new-set {})
  (set-each
   (lambda (e)
     (if (p e)
       (set-add! e new-set)
       void))
   set)
  new-set)
