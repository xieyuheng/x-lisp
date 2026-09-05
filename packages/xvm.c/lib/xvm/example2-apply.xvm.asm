(declare-primitive-function meta-builtin/builtin/println)

(define-function (add1©closure ©closure x)
  (load-int one 1)
  (iadd result x one)
  (return result))

(define-function (test)
  (load-closure f (fn add1©closure))
  (load-int x 41)
  (apply-1 f x)
  (load-result r)
  (call-prim-1 (prim meta-builtin/builtin/println) r)
  (return-void))
