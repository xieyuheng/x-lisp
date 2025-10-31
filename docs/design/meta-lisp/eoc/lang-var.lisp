(define-datatype exp-t
  (exp-var ((name string-t)) exp-t)
  (exp-int ((value int-t)) exp-t)
  (exp-prim ((op string-t) (args (list-t exp-t))) exp-t)
  (exp-let ((name string-t) (rhs exp-t) (body exp-t)) exp-t))

(define-datatype program-t
  (program-new ((info info-t) (body exp-t)) program-t))
