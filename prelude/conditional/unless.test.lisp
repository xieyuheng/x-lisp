(import-all "unless")

(assert-equal (unless #t 1) void)
(assert-equal (unless #f 1) 1)
