(define-function add 2
  (call meta-builtin/builtin/println 0)
  (call meta-builtin/builtin/println 1)
  (return 0))

(define-test add-test
  (load 0 3)
  (load 1 4)
  (call add 0 1)
  (load-result 0)
  (return 0))
