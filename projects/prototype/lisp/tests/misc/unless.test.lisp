(assert-equal (unless #f 1) 1)
(assert-equal (unless #f 1 2) 2)
(assert-equal (unless #t 1) void)
