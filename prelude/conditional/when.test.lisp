(import-all "when")

(assert-equal (when #t 1) 1)
(assert-equal (when #f 1) void)
