(define-datatype atom-t
  (atom-var ((name string-t)) atom-t)
  (atom-int ((value int-t)) atom-t))

(define-datatype c-exp-t
  (c-exp-atom ((atom atom-t)) c-exp-t)
  (c-exp-prim ((op string-t) (args (list-t atom-t))) c-exp-t))

(define-datatype stmt-t
  (stmt-assign ((name string-t) (rhs c-exp-t)) stmt-t))

(define-datatype tail-t
  (tail-return ((exp c-exp-t)) tail-t)
  (tail-seq ((stmt stmt-t) (tail tail-t)) tail-t))

(define-datatype c-program-t
  (c-cprogram-new ((info info-t) (tails (list-t tail-t))) c-program-t))
