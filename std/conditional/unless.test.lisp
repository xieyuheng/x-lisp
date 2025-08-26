(import-all "unless.lisp")

(assert-equal (unless #t 1) void)
(assert-equal (unless #f 1) 1)
