(declare-primitive-function meta-builtin/builtin/println)

(define-function (square x)
  (imul result x x)
  (return result))

(define-function (test)
  (load-int n 3)
  (call-1 (fn square) n)
  (load-result r)
  (call-prim-1 (prim meta-builtin/builtin/println) r)
  (return-void))
