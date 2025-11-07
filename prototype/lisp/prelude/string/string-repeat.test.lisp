(import-all "string-repeat")

(assert-equal "" (string-repeat 0 "a"))
(assert-equal "a" (string-repeat 1 "a"))
(assert-equal "aa" (string-repeat 2 "a"))
(assert-equal "aaa" (string-repeat 3 "a"))
