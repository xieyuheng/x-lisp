(define-datatype (list-t A)
  (list-null () (list-t A))
  (list-cons ((head A) (tail (list-t A))) (list-t A)))
