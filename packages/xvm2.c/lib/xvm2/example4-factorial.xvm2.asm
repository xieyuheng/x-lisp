(declare-primitive-function meta-builtin/builtin/println)

(define-function (factorial n)
  (load-int one 1)
  (int-less-or-equal base n one)
  (branch base (label base-case) (label recur-case))
  base-case
  (load-int result 1)
  (return result)
  recur-case
  (isub m n one)
  (call-1 (fn factorial) m)
  (load-result sub)
  (imul result n sub)
  (return result))

(define-function (test)
  (load-int n 5)
  (call-1 (fn factorial) n)
  (load-result r)
  (call-prim-1 (prim meta-builtin/builtin/println) r)
  (return-void))
