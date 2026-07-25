(define-function factorial 1
  (load 1 1)
  (call meta-builtin/builtin/int-less-or-equal? 0 1)
  (load-result 2)
  (jump-if-not 2 else)
  (load 1 1)
  (return 1)
  else
  (call meta-builtin/builtin/isub 0 1)
  (load-result 1)
  (call factorial 1)
  (load-result 1)
  (tail-call meta-builtin/builtin/imul 1 0))

(define-test factorial-test
  (load 0 3)
  (call factorial 0)
  (load-result 0)
  (call meta-builtin/builtin/println 0)
  (return 0))
